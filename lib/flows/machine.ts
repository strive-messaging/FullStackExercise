/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions
import { Flow, FlowAction, FlowGetInfoAction, FlowMultipleChoiceAction, Member } from '../models'
import { FlowCacheEntry, emptyFlowCache, getCachedFlow, updateFlowCache } from '../models/cache'
import { getMemberByPhoneNumber, updateMemberKey } from '../models/database'

/**
 * Get the next set of messages until there is a request for the member.
 */
export async function getMessages(member: Member, flow: Flow, defaultMessage: string = '') {
  // find what stage of a flow the member is in.
  const cachedFlow = await getCachedFlow(member, flow)

  const startIndex = cachedFlow?.currentIndex ?? 0
  let stopIndex = startIndex

  let isResponseRequest = false
  const messages: string[] = []

  // handle setting a default message, likely from a response to a question.
  if (defaultMessage) {
    messages.push(defaultMessage)
  }

  // converted to every() as we want the index of the definition and ability to exit early.
  flow.definition.every((action: FlowAction, index: number) => {
    // move to next step.
    if (index < startIndex) return true

    messages.push(action.message)
    if (['getInfo', 'multipleChoice'].includes(action.type)) {
      // if there is no cache record, don't set isResponseRequest
      if (!cachedFlow) return false

      isResponseRequest = true
      return false
    }
    stopIndex++

    return true
  })

  // update cached flow
  const cacheEntry = await updateFlowCache(member, flow, stopIndex, isResponseRequest)

  return { cacheEntry, messages, startIndex, stopIndex }
}

/**
 * Handles initializing the simulator and identifying the member.
 */
export async function init(phoneNumber: string, flow: Flow, resetSimulator: boolean) {
  if (resetSimulator) emptyFlowCache()

  // get the member
  const member = await getMemberByPhoneNumber(phoneNumber)

  // should handle scenario of non-existent member; ignoring for the exercise.
  // if (!member) doSomething();

  return { member }
}

/**
 * Handles building the messages to return to the member.
 */
export async function buildResponse(message: string, member: Member, flow: Flow) {
  // Get messages to user until we are rewaiting on a response.
  const { cacheEntry, messages, startIndex } = await getMessages(member, flow)

  // If the request is not handling a response, return current messages.
  if (!cacheEntry?.isResponseRequest) {
    return { messages }
  }

  // Empty response if user keeps submitting after the end of the flow.
  if (cacheEntry.currentIndex >= flow.definition.length) {
    return { messages: [] }
  }

  // Handle the member respoonse.
  return handleMemberResponse(message, member, flow, cacheEntry, startIndex)
}

/**
 * Handles the member's response to our request. And then builds continues to build the messages array.
 */
export async function handleMemberResponse(
  message: string,
  member: Member,
  flow: Flow,
  cacheEntry: FlowCacheEntry,
  startIndex: number
) {
  const flowStep = flow.definition[startIndex]

  let responseMessage: string = ''
  if (flowStep.type === 'getInfo') {
    responseMessage = await handleGetInfo(flowStep, message, member, flow, cacheEntry)
  } else if (flowStep.type === 'multipleChoice') {
    responseMessage = await handleMultipleChoice(flowStep, message, member, flow, cacheEntry)
  }

  // get next messages
  const { messages } = await getMessages(member, flow, responseMessage)

  return { messages }
}

async function handleGetInfo(
  flowStep: FlowGetInfoAction,
  message: string,
  member: Member,
  flow: Flow,
  cacheEntry: FlowCacheEntry
) {
  // update member record
  await updateMemberKey(member.id, flowStep.key, message)

  // update cache
  await updateFlowCache(member, flow, cacheEntry.currentIndex + 1, false)

  // return response
  return flowStep.response
}

async function handleMultipleChoice(
  flowStep: FlowMultipleChoiceAction,
  message: string,
  member: Member,
  flow: Flow,
  cacheEntry: FlowCacheEntry
) {
  const match = flowStep.responses.find((r) => {
    return r.value === message.trim() || r.synonyms.includes(message.trim())
  })
  if (match) {
    // update cache
    await updateFlowCache(member as Member, flow, cacheEntry.currentIndex + 1, false)
    return match.message
  }

  // return non-matching response.
  return flowStep.invalidResponse
}

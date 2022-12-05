/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, Member, Message, MessageResponse } from "../models";

/**
 * Called when chat is first initiated to display
 * initial message for flow to user.
 * @param member
 * @param flow
 */
export async function init(
  member: Member,
  flow: Flow
): Promise<MessageResponse> {
  let stopIndex = 0
  const messages: Message[] = []
  for (const action of flow.definition) {
    messages.push({message:action.message, userMessage: false})
    if (['getInfo', 'multipleChoice'].includes(action.type)) {
      break
    }
    stopIndex++
  }
  return { messages, stopIndex }
}

/**
 * Called when user has sent a message to the api.
 * @param member
 * @param flow
 * @param startIndex
 * @param message
 */
export async function receiveMessage(
  member: Member,
  flow: Flow,
  startIndex: number,
  message: string
): Promise<MessageResponse> {
  let index = 0
  const messages: Message[] = []

  for (const action of flow.definition.slice(startIndex)) {

    // add initial message first time the user replies
    if (startIndex === 0) {
      messages.push({message:action.message, userMessage: false})
    }

    if (index !== 0 && ['getInfo', 'multipleChoice'].includes(action.type)) {
      break
    }

    // GetInfo: Save info in message to key in member
    if (action.type === 'getInfo') {
      (member[action.key] as any) = message;
    }

    // multipleChoice:
    if (action.type === 'multipleChoice') {

      // look for a match in responses value or synonyms
      const match = action.responses.find(r => {
        return r.value === message.trim() || r.synonyms.includes(message.trim())
      })

      // add message for matching response to message array
      if (match) {
        messages.push({message:match.message, userMessage: false})
      }
      // otherwise return unrecognized color message
      else {
        messages.push({message:`Sorry, we don't recognized that color.`, userMessage: false})
      }

    }
    // add message for other flow types
    else {
      messages.push({message:action.message, userMessage: false})
    }
    index++
  }
  // If there are no more messages in the flow to return to the user, send them
  // a thank you message.
  if (!messages.length) {
    messages.push({message:'Thanks for the conversation!', userMessage: false})
  }
  return { messages, stopIndex: startIndex + index, member }
}

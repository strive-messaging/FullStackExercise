import { Flow, Member } from '../models'

/**
 * Fake Cache to Query for active Flows.
 */
export interface FlowCacheEntry {
  memberId: number
  flowId: number
  currentIndex: number
  isResponseRequest: boolean
}

let FAKE_FLOW_CACHE: FlowCacheEntry[] = []

// Fake cache functions are not really async for this exercise.
export const getCachedFlowIndex = async (member: Member, flow: Flow) => {
  return FAKE_FLOW_CACHE.findIndex(
    (entry: FlowCacheEntry) => entry.flowId === flow.id && entry.memberId === member.id
  )
}

export const getCachedFlow = async (member: Member, flow: Flow) => {
  return FAKE_FLOW_CACHE.find(
    (entry: FlowCacheEntry) => entry.flowId === flow.id && entry.memberId === member.id
  )
}

export const emptyFlowCache = () => {
  FAKE_FLOW_CACHE = []
}

export interface FlowCacheProps {
  currentIndex: number
  isResponseRequest: boolean
}

export const updateFlowCache = async (member: Member, flow: Flow, props: FlowCacheProps) => {
  const cachedFlowIndex = await getCachedFlowIndex(member, flow)
  if (cachedFlowIndex !== -1) {
    if (flow.definition.length <= props.currentIndex) {
      // I would assume that the cache would naturally expire at some point.
      FAKE_FLOW_CACHE[cachedFlowIndex].currentIndex = props.currentIndex
      return FAKE_FLOW_CACHE[cachedFlowIndex]
    } else {
      // update flow to next step.
      FAKE_FLOW_CACHE[cachedFlowIndex].currentIndex = props.currentIndex

      // update response expectation.
      FAKE_FLOW_CACHE[cachedFlowIndex].isResponseRequest = props.isResponseRequest

      return FAKE_FLOW_CACHE[cachedFlowIndex]
    }
  } else {
    const entry: FlowCacheEntry = {
      memberId: member.id,
      flowId: flow.id,
      currentIndex: props.currentIndex,
      isResponseRequest: props.isResponseRequest,
    }
    // insert entry
    FAKE_FLOW_CACHE.push(entry)

    return entry
  }
}

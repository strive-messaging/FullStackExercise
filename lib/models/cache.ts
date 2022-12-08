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

export const updateFlowCache = async (
  member: Member,
  flow: Flow,
  stopIndex: number,
  isResponseRequest: boolean
) => {
  const cachedFlowIndex = await getCachedFlowIndex(member, flow)
  if (cachedFlowIndex !== -1) {
    if (flow.definition.length <= stopIndex) {
      // I would assume that the cache would naturally expire at some point.
      FAKE_FLOW_CACHE[cachedFlowIndex].currentIndex = stopIndex
      return FAKE_FLOW_CACHE[cachedFlowIndex]
    } else {
      // update flow to next step.
      FAKE_FLOW_CACHE[cachedFlowIndex].currentIndex = stopIndex

      // update response expectation.
      FAKE_FLOW_CACHE[cachedFlowIndex].isResponseRequest = isResponseRequest

      return FAKE_FLOW_CACHE[cachedFlowIndex]
    }
  } else {
    const entry: FlowCacheEntry = {
      memberId: member.id,
      flowId: flow.id,
      currentIndex: stopIndex,
      isResponseRequest,
    }
    // insert entry
    FAKE_FLOW_CACHE.push(entry)

    return entry
  }
}

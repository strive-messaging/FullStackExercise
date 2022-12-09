/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, Member } from '../models'

export async function init(flow: Flow) {
  let stopIndex = 0
  const messages = []
  for (const action of flow.definition) {
    messages.push(action.message)
    if (['getInfo', 'multipleChoice'].includes(action.type)) {
      break
    }
    stopIndex++
  }
  return { messages, stopIndex }
}

export async function receiveMessage(
  member: Partial<Member>,
  flow: Flow,
  startIndex: number,
  message: string
) {
  let index = 0
  const messages = []
  for (const action of flow.definition.slice(startIndex)) {
    messages.push(action.message)
    if (index !== 0 && ['getInfo', 'multipleChoice'].includes(action.type)) {
      break
    }
    // GetInfo: Save info in message to key in member
    if (action.type === 'getInfo') {
      ;(member[action.key] as any) = message
    }
    if (action.type === 'multipleChoice') {
      const match = action.responses.find((r) => {
        return r.value === message.trim() || r.synonyms.includes(message.trim())
      })
      if (match) {
        messages.push(match.message)
      } else {
        messages.push(`I didn't understand that. ${action.message}`)
        index--
      }
    }
    index++
  }
  return { messages, stopIndex: startIndex + index, member }
}

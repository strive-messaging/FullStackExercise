/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, Member } from "../models";


// Haley's notes: it's not really clear to me under what circumstance you want to use this as opposed to
// receiveMessage - maybe the intention is that this is what you use to kick off the conversation
// on the assumption that the member is not initiating the conversation. In that case, you'd want to
// set up an endpoint so that when you switch between flows, you also can make an API call that ends up
// going through this function and ultimately spits out the first question(s).
// I am choosing not to do that, because I have partially built out a workflow where the member is initially
// greeted with a "welcome" message on switching flows, and then they initiate the step into the relevant flow
// I made this decision because at least one of the flows says "thank you for texting in", which made me
// start working with a perspective that we're responding to the member, not initially soliciting them.

export async function init(
  member: Member,
  flow: Flow
) {
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
  member: Member,
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
      (member[action.key] as any) = message
    }
    if (action.type === 'multipleChoice') {
      const match = action.responses.find(r => {
        return r.value === message.trim() || r.synonyms.includes(message.trim())
      })
      if (match) {
        messages.pop() // if the member message triggered a response, don't re-send the action message
        messages.push(match.message)
        index++
      }
      break
    }
    index++
  }
  console.warn({ messages, stopIndex: startIndex + index, member })
  return { messages, stopIndex: startIndex + index, member }
}

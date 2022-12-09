/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, Member } from "../models";

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
  stopIndex = Math.max(stopIndex, 1) // avoid getting caught in infinite loop if first action in flow requires a response
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
    // Haley's notes: the problem here is that the message (with the key we care about) 
    //  comes in *after* we've sent them the getInfo-type reply.
    // the design problem I've been unable to solve is: unlike the multiple-choice question, here
    //  I am not just looping until I get a satisfactory answer, which means the cursor moves through
    //  the flow past the getInfo question and I'm unable to pick up the name value because when I'm
    //  processing the member message I no longer have the notion that it's in response to the getInfo message
    //  unfortunately I'm getting a migraine and don't think I can reasonably devote more time to this - 
    //  leaving documentation here to explain where I got stuck and turning it in so this doesn't dangle
    //  forever on into the weekend/next week
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
         // note: positioning this inside here means the question will keep getting asked until a 
         //       response that matches is chosen. this makes sense when conceptualized like a phone
         //       tree (like "I'm sorry, please repeat your request") but not if you conceptualize
         //       of the flow like a normal conversation (where nonsense responses might just get skipped)
         //       I chose to implement the former.
        index++
      }
      break
    }
    index++
  }
  return { messages, stopIndex: startIndex + index, member }
}

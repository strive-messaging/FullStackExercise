/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import type { Flow, Member } from "../models";
import { FLOW_END } from "../models";

const memberId = -1; // muchine id

export async function init(
  flow: Flow
) {
  let stopIndex = 0
  const messages = []
  for (const action of flow.definition) {
    const { message, type } = action;
    messages.push( { memberId, text: message });
    
    if (type === 'multipleChoice') {
      return { messages, stopIndex };
    }
    stopIndex++
    if (type === 'getInfo') {
      return { messages, stopIndex };
    }
  }
  return { messages, stopIndex };
}

export async function receiveMessage(
  member: Member,
  flow: Flow,
  startIndex: number,
  message: string
) {
  let index = 0;
  const messages = [];
  
  for (const action of flow.definition.slice(startIndex)) {
    messages.push({ memberId, text: action.message });
    index++;

    // GetInfo: Save info in message to key in member
    if (action.type === 'getInfo') {
      (member[action.key] as any) = message;
    }
    if (action.type === 'multipleChoice') {
      const match = action.responses.find(r => {
        return r.value === message.trim() || r.synonyms.includes(message.trim())
      })
      if (match) {
        messages.pop();
        messages.push({ memberId, text: match.message });
      }
    }
    if (['getInfo', 'multipleChoice'].includes(action.type)) {
      break;
    }
  }

  if (flow.definition.length <= startIndex) {
    messages.push({memberId, text: FLOW_END});
  }

  return { messages, stopIndex: startIndex + index, member };
}
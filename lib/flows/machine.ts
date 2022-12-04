/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, Member, MEMBERS } from "../models";

export async function init(
  member: Member,
  flow: Flow
) {
  let stopIndex = 0
  const messages = []
  let currentMember: Partial<Member> = {
    id: MEMBERS.length+1,
    name: `guest-${MEMBERS.length+1}`,
    isSubscribed: false,
  }

  const memberIndex = MEMBERS.findIndex(({ id }) => id === member.id)
  if (memberIndex > -1)
    currentMember = MEMBERS[memberIndex]
  else MEMBERS.push(currentMember)

  for (const action of flow.definition) {
    messages.push({ ...action })

    if (['getInfo', 'multipleChoice'].includes(action.type)) {
      break
    }
    stopIndex++
  }

  return {
    flowName: flow.name,
    messages,
    stopIndex,
    member: currentMember,
  }
}

export async function receiveMessage(
  member: Member,
  flow: Flow,
  startIndex: number,
  message: string,
) {
  let index = 0
  const messages = []
  const flowAction = flow.definition[startIndex-1]
  let currentMember: Partial<Member> = {
    id: MEMBERS.length+1,
    name: `guest-${MEMBERS.length+1}`,
    isSubscribed: false,
  }

  const memberIndex = MEMBERS.findIndex(({ id }) => id === member.id)
  if (memberIndex > -1)
    currentMember = MEMBERS[memberIndex]
  else MEMBERS.push(currentMember)

  if (flowAction.key) {
    (currentMember[flowAction.key] as any) = flowAction.type === 'multipleChoice' && flowAction.key === 'isSubscribed'
      ? message.startsWith('Yes')
      : message
  }

  for (const action of flow.definition.slice(startIndex)) {
    messages.push({ ...action })

    if (index !== 0 && action.key)
      break

    index++
  }

  console.log("🚀 ~ member", currentMember)
  return { messages, stopIndex: startIndex + index, member: currentMember }
}

/* eslint-disable max-params */

// Flow Machine
// Implements a cursor that advances across a flow definition
// and processes inputs with actions

import { Flow, FlowType, Member, Message } from "../models";

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

export class MachineMessaging {
  public messages: Message[]
  public flowType: FlowType
  public awaitingResponse: boolean
  public nextResponse: string
  public previousFlowType: FlowType

  public constructor (messages: Message[] = [], flowType: FlowType = FlowType.STANDARD) {
    this.messages = messages
    this.flowType = flowType
    this.awaitingResponse = false
    this.nextResponse = ''
    this.previousFlowType = FlowType.STANDARD
  }

  public receiveMessage(
    member: Member,
    flow: Flow,
    startIndex: number,
    message: string,
  ) {
    let index = 0
    const messagePayload = {
      message,
      member,
      flow,
      index: this.messages.length,
    }

    // store message in persistent array (would normally be in a database)
    this.storeMessage(messagePayload)

    // store the current flow type (important for handling multiple choice & sequential responses)
    this.setFlowType(flow.type)

    const responses: Message[] = []
    const responsePayload = {
      message: '',
      member: {
        id: 0,
        name: 'StriveBot',
        email: 'info@strivemessaging.org',
        phoneNumber: '+12222322332',
        isSubscribed: true,
      },
      flow,
      index: this.messages.length,
    }

    if (this.awaitingResponse && this.nextResponse.length && this.previousFlowType === FlowType.FORM) {
      responses.push({
        ...responsePayload,
        message: this.nextResponse,
      })

      this.nextResponse = ''
      this.expectResponse(false)
    } else {
      for (const action of flow.definition.slice(startIndex)) {
        if (action.type === 'getInfo') {
          this.previousFlowType = FlowType.FORM
          this.expectResponse(true)

          responses.push({
            ...responsePayload,
            message: action.message,
          })

          // (member[action.key] as any) = message
        } else if (this.previousFlowType === FlowType.FORM && action.type === 'message' && this.awaitingResponse) {
          this.nextResponse = action.message

          break
        }

        if (!this.awaitingResponse) {
          responses.push({
            ...responsePayload,
            message: action.message,
          })
        }

        if (action.type === 'multipleChoice') {
          // expect a response from the user
          this.expectResponse(true)

          const match = action.responses.find(r => {
            return r.value === message.trim() || r.synonyms.includes(message.trim())
          })

          if (match) {
            this.storeMessage({
              member: {
                id: 0,
                name: 'StriveBot',
                email: 'info@strivemessaging.org',
                phoneNumber: '+12222322332',
                isSubscribed: true,
              },
              flow,
              message: match.message,
              index: this.messages.length,
            })
            responses.push({
              ...responsePayload,
              message: match.message,
            })

            // no longer expecting a response
            this.expectResponse(false)
          }
        }

        index++
      }
    }

    console.warn({ messages: this.messages, stopIndex: startIndex + index, member, responses })
    return { messages: this.messages, stopIndex: startIndex + index, member, responses }
  }

  private expectResponse(status: boolean) {
    this.awaitingResponse = status
  }

  private storeMessage(message: Message) {
    this.messages.push(message)
  }

  private setFlowType(flowType: FlowType) {
    this.flowType = flowType
  }
}
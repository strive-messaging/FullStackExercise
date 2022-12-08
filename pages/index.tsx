import Head from 'next/head'
import { MemberMessage } from '../lib/models'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

async function simulateFlow(
  flowId: number,
  phoneNumber: string,
  message: string,
  resetSimulator: boolean = false
) {
  const res = await fetch(`/api/flows/${flowId}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneNumber,
      message,
      resetSimulator,
    }),
  })

  // if flow or member are not known.
  if (res.ok) {
    const data = await res.json()
    return data
  }
}

export default function Home() {
  const [flowId, setFlowId] = useState(1)

  // Phone Number to identify the member.
  const phoneNumber = '406-570-3068'

  // Initial message from user initiating flow.
  const initialMessage: MemberMessage = {
    message: `[${phoneNumber}] initiates flow ${flowId}; Waiting for response...`,
    isMember: true,
  }

  // This format provided for convenience. Please change if necessary.
  const [messages, setMessages] = useState([initialMessage] as MemberMessage[])

  // Message to bind to the message text input.
  const initialMemberMessage: MemberMessage = { message: '', isMember: true }
  const [memberMessage, setMemberMessage] = useState(initialMemberMessage)

  // Adds messages to the state.
  const addMessages = (newMessages: MemberMessage[]) => {
    setMessages((existingMessages) => existingMessages.concat(newMessages))
  }

  // Handles adding the messages from a response. Converts the strings from server to MemberMessages.
  const handleFlowResponse = (data: any) => {
    if (data?.messages && Array.isArray(data.messages)) {
      const serverMessages = data.messages.map((message: string) => {
        return {
          message: message,
          isMember: false,
        }
      })

      addMessages(serverMessages)
    }
  }

  // initiate a new flow when flowId changes.
  useEffect(() => {
    // member initiates new flow with message.
    setMessages(() => [initialMessage])

    // submit request to the api
    simulateFlow(flowId, phoneNumber, '', true).then((data: object) => {
      if (!data) return

      handleFlowResponse(data)
    })
  }, [flowId])

  // light hack to scroll to bottom if messages start to scroll.
  const scrollToBottomRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Handles changing the active flow.
   */
  const onActiveFlowChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFlowId(parseInt(e.target.value || '1', 10))

  /**
   * Handles setting value of member message.
   */
  const onMessageChange = (e: ChangeEvent<HTMLInputElement>) =>
    setMemberMessage({ message: e.target.value, isMember: true })

  /**
   * Handles key presses in the response text field.
   */
  const onMessageKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // add message to messages
      addMessages([memberMessage])

      // clear member message
      setMemberMessage(initialMemberMessage)

      // submit message to api endpoint
      simulateFlow(flowId, phoneNumber, memberMessage.message).then((data: object) => {
        if (!data) return

        // update messages by response.
        handleFlowResponse(data)
      })
    }
  }

  return (
    <div className="h-screen bg-gray-50">
      <Head>
        <title>Strive Flow Simulation Exercise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Flow Simulator
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Change the active flow to simulate a message chain.
            </p>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            <label
              className="block mt-2 font-semibold text-center text-sm text-gray-600 "
              htmlFor="active-flow"
            >
              Test Active Flow
            </label>
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="active-flow"
              onChange={onActiveFlowChange}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="border-solid border-2 border-indigo-600 h-64 overflow-auto">
                {messages.map((m, i) => (
                  <div key={i} className={'m-1 ' + (m.isMember ? 'bg-teal-100' : 'bg-slate-200')}>
                    {m.message}
                  </div>
                ))}
                <div ref={scrollToBottomRef} />
              </div>
              <div className="border-solid border border-slate-100 my-1">
                <label className="sr-only" htmlFor="member-message">
                  Message
                </label>
                <input
                  className="w-full p-2"
                  id="member-message"
                  onChange={onMessageChange}
                  onKeyPress={onMessageKeyPress}
                  value={memberMessage.message}
                  placeholder="Send message"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

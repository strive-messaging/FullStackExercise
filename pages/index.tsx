import Head from 'next/head'
import { Member, MemberMessage } from "../lib/models";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

async function simulateFlow(flowId: number, member: any, message: string) {
  const res = await fetch(`/api/flows/${flowId}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      member,
      message,
      startIndex: 0,
    }),
  })
  console.warn("res", res)
  return res
}

export default function Home() {
  const [flowId, setFlowId] = useState(1)

  // Dummy Member; Unclear if this should be removed later.
  const member: Member = {
    id: 418,
    name: 'Jake Dolan',
    email: 'jake@cascadin.com',
    phoneNumber: '406-570-3068',
    isSubscribed: false,
  }

  // Initial message from user initiating flow.
  const initialMessage: MemberMessage = {message: `Member initiates flow ${flowId}; Waiting for response...`}

  // This format provided for convenience. Please change if necessary.
  const [messages, setMessages] = useState([initialMessage])

  // Message to bind to the message text input.
  const [memberMessage , setMemberMessage] = useState('')

  // initiate a new flow when flowId changes.
  useEffect(() => {
    // member initiates new flow with message.
    setMessages([initialMessage]);

    // submit request to the api
    simulateFlow(flowId, member, '')
  }, [flowId]);

  /**
   * Handles changing the active flow.
   */
  const onActiveFlowChange = (e: ChangeEvent<HTMLSelectElement>) => setFlowId(parseInt(e.target.value || '1', 10))

  /**
   * Handles setting value of member message.
   */
  const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => setMemberMessage(e.target.value)

  /**
   * Handles key presses in the response text field.
   */
  const onMessageKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // add message to messages
      messages.push({message: memberMessage})

      // submit message to api endpoint
      simulateFlow(flowId, member, memberMessage).then((res: object) => {
        // clear member message
        setMemberMessage('')
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
            <label className="block mt-2 font-semibold text-center text-sm text-gray-600 " htmlFor="active-flow">Test Active Flow</label>
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
              <div className="border-solid border-2 border-indigo-600 h-64">
                {messages.map((m, i) => (
                  <div key={i} className="m-1 bg-slate-200">
                    {m.message}
                  </div>
                ))}
              </div>
              <div className="border-solid border border-slate-100 my-1">
                <label className="sr-only" htmlFor="member-message">Message</label>
                <input
                  className="w-full px-1"
                  id="member-message"
                  onChange={onMessageChange}
                  onKeyPress={onMessageKeyPress}
                  value={memberMessage}
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

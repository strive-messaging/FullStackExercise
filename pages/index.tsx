import { Member } from '@/lib/models'
import Head from 'next/head'
import { useState } from 'react'

export interface Message {
  text: string,
  isUser: boolean // true = input by user; false = response by flow
}

async function simulateFlow(flowId: number, member: Member, message: string, index: number) {
  const res = await fetch(`/api/flows/${flowId}/simulate/`, {
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
  return await res.json()
}

export default function Home() {
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberPhoneNumber, setMemberPhoneNumber] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [flowId, setFlowId] = useState(1)
  const [messages, setMessages] = useState([{ text: 'Welcome!', isUser: false }])
  const [currentMessage, setCurrentMessage] = useState('')
  const [index, setIndex] = useState(0)

  return (
    <div className="h-screen bg-gray-50">
      <Head>
        <title>Strive Flow Simulation Exercise</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Please implement a &quot;Flow Simulator&quot;
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              At the endpoint `/api/flows/[flowId]/simulate`, please implement a route that takes
              whatever inputs may be necessary and returns whatever information you feel is
              necessary to conduct and display an ongoing conversation between a member and a flow.
              Below, please display the messages, back and forth, between the member and the flow.
            </p>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            First, tell us a little bit about yourself:
            <br/>
            <br/>
            <input
              className='w-full personal-info'
              value={memberName}
              onChange={(e) => setMemberName(e.currentTarget.value)}
              placeholder='Name'
            />
            <input
              className='w-full personal-info'
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.currentTarget.value)}
              placeholder='Email'
            />
            <input
              className='w-full personal-info'
              value={memberPhoneNumber}
              onChange={(e) => setMemberPhoneNumber(e.currentTarget.value)}
              placeholder='Phone Number'
            />
            Do you want to subscribe to receive updates?
            <input
              className='checkbox'
              type='checkbox'
              checked={isSubscribed}
              onChange={(e) => {setIsSubscribed(e.target.checked)}}
            />
            <br/>
            <br/>
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => setFlow(parseInt(e.target.value || '1', 10))}
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <p className="mt-2 text-center text-sm text-gray-600">
              Feel free to use (or not use) this selector to flip between potential flows. Three are
              provided.
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="border-solid border-2 border-indigo-600 h-64">
                {messages.map((m, i) => (
                  <div key={i} className={`m-1 ${m.isUser ? 'user-message bg-slate-100' : 'bg-slate-200'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="border-solid border border-slate-100 my-1">
                <input
                  className="w-full"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.currentTarget.value)}
                  placeholder="Send message"
                  onKeyUp={(e) => {if (e.key === 'Enter') {sendMessage()} }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  async function setFlow(flowId: number) {
    setFlowId(flowId)
    // reset the chat messages when user switches flows
    setMessages([{text: 'Welcome!', isUser: false}])
  }

  async function sendMessage() {
    const member = {
      id: 1234, // if we had a login system this would be a meaningful number; for the toy example, just use dummy value
      name: memberName,
      email: memberEmail,
      phoneNumber: memberPhoneNumber,
      isSubscribed: isSubscribed
    }
    const response = await simulateFlow(flowId, member, currentMessage, index)
    setMessages([...messages, 
      {text: currentMessage, isUser: true},
      {text: response.messages[0], isUser: false}
    ])
    setIndex(index + 1)
    setCurrentMessage('')
  }
}

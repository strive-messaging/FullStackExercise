import { Member, Message } from '@/lib/models'
import Head from 'next/head'
import { ChangeEvent, KeyboardEvent, useCallback, useRef, useState } from 'react'

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
  .then(res => res.json())
  .catch(err => {
    console.error(err)
    return err
  })
  console.log(res)

  return res
}

// input sanitizer
const youShallNotPass = (message: string): string => {
  const cleanMessage = new DOMParser().parseFromString(message, 'text/html')

  return cleanMessage.body.textContent || ''
}

export default function Home() {
  const messageListRef = useRef<any>(null)
  const [flowId, setFlowId] = useState(1)
  const [member, setMember] = useState<Member>({
    id: 1479975,
    name: 'Ross Libby',
    email: 'rosslibby214@gmail.com',
    phoneNumber: '+15129050136',
    isSubscribed: false,
  })
  const [message, setMessage] = useState<string>('')

  // This format provided for convenience. Please change if necessary.
  const [messages, setMessages] = useState<{
    message: string,
    member?: Member,
    flow: number,
  }[]>([])

  const handleMessageInput = (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

  const handleMessageSubmit = useCallback(async (): Promise<void> => {
    const cleanMessage: string = youShallNotPass(message)

    // add the sent message to the user's view
    setMessages((prevState) => [
      ...prevState,
      {
        flow: flowId,
        message: cleanMessage,
        member,
      },
    ])

    let messageListElement = messageListRef.current || null

    if (messageListElement) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }

    // clear the message input
    setMessage('')

    // submit the message to endpoint
    try {
      const response = await simulateFlow(flowId, member, cleanMessage)

      if (response.ok) {
        setMessages(prevState => [
          ...prevState,
          ...response.data.responses,
        ])
      }

      if (messageListElement) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
      }
    } catch (err) {
      console.error('There was a problem with the message:', err)
    }
  }, [flowId, member, message, setMessage, setMessages, messageListRef])

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    // sanitize the input
    if (e.key === 'Enter') {
      handleMessageSubmit()
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
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Please implement a &quot;Flow Simulator&quot;
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              At the endpoint `/api/flows/[flowId]/simulate`, please implement a route that takes
              whatever inputs may be necessary and returns whatever information you feel is
              necessary to conduct and display an ongoing conversation between a member and a flow.
              Below, please display the messages, back and forth, betwen the member and the flow.
            </p>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => setFlowId(parseInt(e.target.value || '1', 10))}
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


          <div className="border-solid border border-slate-100 my-1 sm:flex sm:justify-between">

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="flex flex-col w-full border-solid border-2 border-indigo-600 h-64 items-start overflow-scroll" ref={messageListRef}>
                {messages.map((m, i) => (
                  <div key={i} className="flex flex-row w-full">
                    <span className="flex flex-grow box-border py-2 px-2">{m.message}</span>
                    <span className="flex box-border py-2 px-2">{
                      m.member?.id === member?.id
                        ? <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">You</span>
                        : <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">StriveBot</span>}</span>
                  </div>
                ))}
              </div>
              <div className="inline-flex w-full items-center mt-2">
                <input
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm padding-lg py-2 px-3 mr-2"
                  onChange={handleMessageInput}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your message"
                  value={message}
                />
                <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Send
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -mr-2 ml-2">
                    <path fill="rgba(255, 255, 255, .25)" strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

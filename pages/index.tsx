import { Member } from '@/lib/models'
import Head from 'next/head'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'

interface SimulateFlowRequestPayload {
  flowId: number
  member: Partial<Member>
  message: string
  startIndex: number
}

interface FlowMessage {
  message: string
  senderType: SenderType
}

type SenderType = 'user' | 'flow'

async function simulateFlow({
  flowId,
  member,
  message,
  startIndex = 0,
}: SimulateFlowRequestPayload) {
  const res = await fetch(`/api/flows/${flowId}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      member: member || {},
      message,
      startIndex,
    }),
  })
  return res
}

export default function Home() {
  const [flowId, setFlowId] = useState(1)
  const [member, setMember] = useState<Partial<Member>>({ id: 1 })
  const [messages, setMessages] = useState<FlowMessage[]>([])
  const [userMessage, setUserMessageText] = useState('')
  const [startIndex, setStartIndex] = useState(0)

  const startConversation = useCallback(async () => {
    const response = await simulateFlow({ flowId, member, message: '', startIndex: 0 })
    const data = await response.json()

    setMessages(
      (data.result.messages as string[]).map((message) => ({ message, senderType: 'flow' }))
    )
    setStartIndex(data.result.stopIndex)
    setMember(data.result.member)
  }, [flowId])

  useEffect(() => {
    startConversation().catch(console.error)
  }, [startConversation])

  async function sendMessage() {
    const optimisticallyUpdatedMessages = [
      ...messages,
      { message: userMessage, senderType: 'user' as SenderType },
    ]
    setMessages(optimisticallyUpdatedMessages)
    setUserMessageText('')

    try {
      const response = await simulateFlow({
        flowId,
        member: member,
        message: userMessage,
        startIndex,
      })
      const data = await response.json()

      setMember(data.result.member)
      setStartIndex(data.result.stopIndex)
      setMessages([
        ...optimisticallyUpdatedMessages,
        ...(data.result.messages as string[]).map((message) => ({
          message,
          senderType: 'flow' as SenderType,
        })),
      ])
    } catch (error) {
      console.error(error)
    }
  }

  async function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || userMessage.trim().length === 0) {
      return
    }
    sendMessage()
  }

  function renderMessage(message: FlowMessage, memberName: string, i: number) {
    switch (message.senderType) {
      case 'flow':
        return (
          <div key={i} className="m-1 bg-slate-200" title="Bot">
            <div className="inline-flex mr-2 ml-2 overflow-hidden relative justify-center items-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                B
              </span>
            </div>
            <span>{message.message}</span>
          </div>
        )
      case 'user':
        return (
          <div key={i} className="m-1 bg-sky-200 text-right" title={memberName}>
            <span>{message.message}</span>
            <div className="inline-flex ml-2 overflow-hidden relative justify-center items-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {memberName[0].toUpperCase()}
              </span>
            </div>
          </div>
        )
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

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="border-solid border-2 border-indigo-600 h-64 overflow-auto">
                {messages.map((m, i) => renderMessage(m, member?.name || 'Guest', i))}
              </div>
              <div className="border-solid border border-slate-100 my-1">
                <input
                  className="w-full"
                  value={userMessage}
                  onChange={(e) => setUserMessageText(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                  placeholder="Send message"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

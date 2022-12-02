import { useState, useEffect } from 'react'
import { FlowResult } from '@/types/form'
import { Message } from '@/lib/models'
import Header from '@/lib/components/Header'
import Footer from '@/lib/components/Footer'
import MessageFeed from '@/lib/components/MessageFeed'
import TextFlow from '@/lib/components/TextFlow'

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
  return res.json()
}

async function initFlow(flowId: number, member: any) {
  const res = await fetch(`/api/flows/${flowId}/${member.id || 0}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return res.json()
}

export default function Home() {
  const [flowId, setFlowId] = useState(1)
  const [flowHeader, setFlowHeader] = useState('')
  const [query, setQuery] = useState('')
  const [scriptedMessages, setScriptedMessages] = useState([] as Message[])
  const [messageFeed, setMessageFeed] = useState([] as Message[])
  const [currentIndex, setCurrentIndex] = useState(1)
  const [lastIndex, setLastIndex] = useState(1)
  const [isAwaitingUserInput, setIsAwaitingUserInput] = useState(true)

  const moveFlow = () => {
    setMessageFeed(oldState => [...oldState, {message: query} as unknown as Message])
    setQuery('')

    if (currentIndex === lastIndex)
      setIsAwaitingUserInput(false)
    else setCurrentIndex(currentIndex+1)
  }

  useEffect(() => {
    initFlow(flowId, {}).then(({
      flowName,
      messages,
      stopIndex
    }: FlowResult) => {
      setFlowHeader(flowName)
      setLastIndex(stopIndex)
      setScriptedMessages(messages)
      setMessageFeed(messages)
    })
  }, [flowId])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <main className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {flowHeader}
            </h1>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={({ target }) => {
                setMessageFeed([])
                setFlowId(parseInt(target.value || '1', 10))
              }}
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
            <MessageFeed {...{
              messageFeed,
              scriptedMessages,
              currentIndex,
              lastIndex,
              isAwaitingUserInput,
            }}/>

            <TextFlow {...{
              query,
              isAwaitingUserInput,
              setQuery,
              moveFlow,
            }}/>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

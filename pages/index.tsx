import Head from 'next/head'
import {useEffect, useState} from 'react'
import {Member, Message, MEMBER} from "@/lib/models";

/**
 * Calls the backend to send and retrieve messages
 * @param flowId
 * @param member
 * @param message
 * @param startIndex
 */
async function simulateFlow(flowId: number, member: Member, message: string, startIndex: number) {
  // got an error about relative paths without parsing the URL
  const url = new URL(`/api/flows/${flowId}/simulate`, 'http://localhost:3000')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      member,
      message,
      startIndex: startIndex,
    }),
  })
  return res
}

/**
 * Home() Component.
 */
export default function Home() {

  const [flowId, setFlowId] = useState<number>(1)
  const [messages, setMessages] = useState<Message[]>([])
  const [sentMessage, setSentMessage] = useState<string>('')
  const [messageSent,setMessageSent] = useState<string>('')
  const [startIndex, setStartIndex] = useState<number>(0)

  // useEffect hook to call the api.
  // Will be called when either flowId or startIndex state has been updated.
  useEffect( () => {

    // flowId is set in initial state value, but just in case,
    // handle it being null
    if (flowId == null) {
      return;
    }

    // Call api and update messages state.
    simulateFlow(flowId, MEMBER, sentMessage, startIndex).then(function(response) {
      return response.json();
    }).then(function(response) {
      for (const msg of response.data.messages) {
        setMessages(messages => [...messages, msg])
      }
    });

  }, [flowId,startIndex])

  // Submit button handler.
  // Updates state for sentMessage;
  // Updates state for startIndex (which triggers useEffect to call the api again);
  // Clears send message state (which clears the form input).
  const handleSend = () => {
    setStartIndex(startIndex+1)
    setMessages(messages => [...messages, {message: messageSent, userMessage: true}])
    setSentMessage(messageSent)
    setMessageSent('')
  };

  // Clears states when flow option is changed and sets flowId in state.
  const handleFlowChange = (event: any) => {
    setSentMessage('')
    setMessages([])
    setMessageSent('')
    setStartIndex(0)
    setFlowId(parseInt(event.target.value || '1', 10))
  };

  // Sets the value of the message input in setMessageSent state.
  const handleSendMessageChange = (event: any) => {
    setMessageSent(event.target.value);
  };

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
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={handleFlowChange}
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
                {messages?.map((m: Message, i: number) =>
                  {
                    return <div key={i} className={`${m.userMessage ? "ml-auto bg-slate-300  justify-end" : "bg-slate-200"} p-2 m-1 rounded-md w-3/4  flex flex-row`}>
                      {m.message}
                    </div>
                  }
                )}
              </div>
              <div className="my-1 flex">
                <div className="border-solid border border-slate-100 flex-grow">
                  <input
                    className="w-full p-2"
                    id="sentMessageInput"
                    name="sentMessageInput"
                    onChange={handleSendMessageChange}
                    placeholder="Send message"
                    value={messageSent}
                  />
                </div>
                <div className="ml-1">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-25" onClick={handleSend} disabled={!messageSent}>
                    Send
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

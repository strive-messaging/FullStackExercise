import Head from 'next/head';
import { useEffect, useRef, useState } from 'react'
import { FLOWS, FLOW_END } from '@/lib/models'
import { EOFMessage, MachineMessage, UserMessage } from '@/components/Message'
import { PrimaryButton, SecondaryButton } from '@/components/Button'
import type { Flow, Member } from '@/lib/models'

async function simulateFlow(flowId: number, member: Member, message: string, startIndex: number = 0) {
  const res = await fetch(`/api/flows/${flowId}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      member,
      message,
      startIndex
    }),
  })
  const messages = await res.json();
  return messages;
}

type Message = {
  memberId: Member['id'],
  text: string
}

type FlowState = {
  startIndex: number,
  messages: Message[]
}

const emptyFlow: FlowState = {
  startIndex: 0,
  messages: []
}

const member: Member = {
  id: 0,
  name: '',
  email: '',
  phoneNumber: '',
  isSubscribed: false
};

export default function Home() {
  const [flowId, setFlowId] = useState(0);
  const [flowState, updateFlow] = useState<FlowState>(emptyFlow);
  const [userMessage, setUserMessage] = useState('');
  const endMarker = useRef<HTMLDivElement>(null);

  const isActiveFlow = flowId !== 0;

  const sendUserMessage = () => {
    simulateFlow(flowId, member, userMessage, flowState.startIndex)
    .then(result => {
      const { ok, messages, stopIndex } = result;
      if (ok) {
        updateFlow({
          startIndex: stopIndex,
          messages: [...[...flowState.messages, { memberId: member.id, text: userMessage }, ...messages]]
        })
        setUserMessage('')
      }
    });
  }

  useEffect(()=> {
    endMarker.current && endMarker.current.scrollIntoView({ behavior: "smooth" })
  }, [flowState.messages])

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
               &quot;Flow Simulator&quot;
            </h2>
            <div className="mt-2 text-center text-sm text-gray-600">
              <div>
              <p className="mt-2 text-center text-sm text-gray-600">
                We have couple topics to chat about. Feel free to choose another one any time.
              </p>          
              </div>
            </div>
          </div>
          <div className="mt-8 mx-auto max-w-sm text-center">
            <select
              className="border mx-auto border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => {
                const fId = parseInt(e.target.value, 10);
                setFlowId(fId);

                if (fId > 0) { 
                  simulateFlow(fId, member, '', 0).then(data => {
                    const { ok, messages, stopIndex } = data;
                    if (ok) {
                      updateFlow({
                        startIndex: stopIndex,
                        messages
                      });
                    }
                  })
                } else {
                  updateFlow(emptyFlow);
                }
              }
              }
            >
              <option value="0">Please select desired flow</option>
              {
                FLOWS.map((flow: Flow) => {
                  const { id, name } = flow;
                  return <option value={id} key={id}>{name}</option>
                })
              }
            </select>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="border-solid border-2 border-indigo-600 h-64 overflow-y-scroll">
                {
                  flowState.messages.map((msg: Message, idx: number) => {
                    const { memberId, text } = msg;
                    const key = `${memberId}-${idx}`;
                    return memberId === member.id ? <UserMessage key={key}>{text}</UserMessage>
                    : text === FLOW_END ? <EOFMessage key={key}>thanks for your messages, this flow is ended</EOFMessage> : <MachineMessage key={key}>{text}</MachineMessage>
                  })
                }
                <div ref={endMarker} />
              </div>
              <div className="flex items-center">
                <input
                  className="w-full border-solid border border-slate-100 rounded-md my-1 grow w-full h-10"
                  disabled={!isActiveFlow}
                  value={userMessage}
                  onChange={(evt) => setUserMessage(evt.target.value)}
                  onKeyDown={(evt) => {
                    const { code } = evt;
                    if (code === 'Enter' && userMessage !== '') {
                      sendUserMessage();
                    }
                    if (code === 'Escape') {
                      setUserMessage('');
                    }
                  }
                  }
                  placeholder="Write message, press ENTER to send"
                />
              <PrimaryButton disabled={!isActiveFlow || userMessage === ''} onClick={sendUserMessage}>send</PrimaryButton>
              <SecondaryButton disabled={!isActiveFlow  || userMessage === ''} onClick={() => setUserMessage('')}>clear</SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

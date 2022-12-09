import Head from 'next/head'
import { useState } from 'react'
import FlowSim from './components/FlowSim';

export default function Home() {
  const [flowId, setFlowId] = useState(3)

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
          <FlowSim flowId={flowId}></FlowSim>
        </div>
      </main>
    </div>
  )
}

import { init, receiveMessage } from '@/lib/flows/machine'
import { Flow, FLOWS, Member } from '@/lib/models'
import { NextApiRequest, NextApiResponse } from 'next'

// Flow Simulation Endpoint
// By making a series of requests to this endpoint, please simulate the back-and-forth
// of interaction with a flow in a way that can be displayed in the frontend

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { flowId } = req.query
  const flow = FLOWS.find((f) => f.id === parseInt(flowId as string, 10))
  if (!flow) {
    res.status(404).end()
  }

  //await init('???', flow)

  const { member, message, startIndex = 0 } = req.body

  const result = await receiveMessage(
    member as unknown as Member,
    flow as Flow,
    startIndex,
    message
  )
  console.warn(result)
  return res.json(result)
}

import { init, receiveMessage } from '@/lib/flows/machine'
import { Flow, FLOWS, Member } from '@/lib/models'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const simulateRequestSchema = z.object({
  member: z.object({
    id: z.number(),
    name: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    isSubscribed: z.boolean().optional(),
  }),
  message: z.string().optional(),
  startIndex: z.number(),
})

// Flow Simulation Endpoint
// By making a series of requests to this endpoint, please simulate the back-and-forth
// of interaction with a flow in a way that can be displayed in the frontend

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { flowId } = req.query
  const flow = FLOWS.find((f) => f.id === parseInt(flowId as string, 10))
  if (typeof flow === 'undefined') {
    return res.status(404).end()
  }

  const simulateRequest = simulateRequestSchema.safeParse(req.body)
  if (!simulateRequest.success) {
    return res.status(500).end()
  }

  const { member, message, startIndex = 0 } = simulateRequest.data

  // CHALLENGE ZONE:
  // Please do something here to allow simulation of interaction with the flow!
  let result

  // The flow begins the conversation
  if (startIndex === 0 && message === '') {
    result = await init(flow)
  } else {
    // The user has replied to the flow
    result = await receiveMessage(member as unknown as Member, flow as Flow, startIndex, message)
    result.messages = filterToNewMessages(result.messages, flow, startIndex)
  }

  console.warn(result)
  return res.json({
    ok: true,
    result,
  })
}

const filterToNewMessages = (messages: string[], flow: Flow, previousActionIndex: number) => {
  if (!messages.length) {
    return messages
  }
  const lastMessage = flow.definition[previousActionIndex].message

  const startIndex = messages.indexOf(lastMessage) + 1
  return messages.slice(startIndex)
}

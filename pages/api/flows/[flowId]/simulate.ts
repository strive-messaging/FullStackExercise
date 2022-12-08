import { init, buildResponse } from '@/lib/flows/machine'
import { Flow, FLOWS, Member } from '@/lib/models'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Used to randomly pause a response between 500 - 1500 milliseconds.
 *
 * @returns {Promise}
 */
const randomPause = async () => {
  const max = 1500
  const min = 500
  const delayFor = Math.floor(Math.random() * (max - min) + min)
  return new Promise((resolve) => {
    setTimeout(resolve, delayFor)
  })
}

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

  // removed startIndex and full member object.
  const { phoneNumber, message, resetSimulator } = req.body

  // initialize flow and look up member.
  const { member } = await init(phoneNumber, flow as Flow, resetSimulator)
  // this is just a placeholder to handle if the member isn't recognized.
  if (!member) {
    res.status(200).json({ messages: ['unknown number'] })
  }

  // build messages
  const response = await buildResponse(message, member as Member, flow as Flow)

  // delay response to simulate response time.
  await randomPause()

  return res.status(200).json({ messages: response.messages })
}

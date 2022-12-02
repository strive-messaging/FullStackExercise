import { init } from '@/lib/flows/machine'
import { Flow, FLOWS, Member, MEMBERS } from '@/lib/models'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { flowId, memberId } = req.query
  const flow = FLOWS.find(({ id }) => id === parseInt(flowId as string, 10))
  if (!flow) {
    res.status(404).end()
  }

  let member = {
    name: 'guest',
    isSubscribed: false,
  }

  const mId = parseInt(memberId as string, 10)
  if (mId) {
    member = MEMBERS.find(({ id }) => id === mId) as unknown as Member
    if (!member) {
      res.status(404).end()
    }
  }

  const result = await init(
    member as unknown as Member,
    flow as Flow,
  )

  return res.json(result)
}

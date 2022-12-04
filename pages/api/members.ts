import { MEMBERS } from '@/lib/models'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return res.json(MEMBERS)
}

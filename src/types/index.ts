import type { NextApiRequest, NextApiResponse } from 'next'

export type Handle = {
  req: NextApiRequest
  res: NextApiResponse
}

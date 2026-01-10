// 这与 `pages/api/index.ts` 相同。

import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).send({ text: '此文本来自 `/api/apps/debug` 路由' })
  }

  if (req.method === 'POST') {
    return res.status(200).send(req.body)
  }

  return res.status(400).send({ text: '错误请求' })
}

export default withMiddleware('verifyRequest')(handler)

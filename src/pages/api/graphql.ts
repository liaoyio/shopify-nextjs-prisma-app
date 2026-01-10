import withMiddleware from '@/server/middleware'
import shopify from '@/server/shopify/config'
import sessionHandler from '@/server/shopify/session'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // 拒绝任何非 POST 的请求
  if (req.method !== 'POST') {
    return res.status(400).send({ text: '我们这里不支持这个操作。' })
  }

  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    })
    const session = await sessionHandler.loadSession(sessionId as string)
    if (!session) {
      throw new Error('未找到会话')
    }
    const response = await shopify.clients.graphqlProxy({
      session,
      rawBody: req.body,
    })

    res.status(200).send(response.body)
  } catch (e) {
    const error = e as Error
    console.error('/api/graphql 发生错误', error)
    return res.status(403).send(error)
  }
}

export default withMiddleware('verifyRequest')(handler)

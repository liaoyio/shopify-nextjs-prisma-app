import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(401).send('必须是 POST')
  }
  try {
    const { body } = req
    const shop = req.body.shop_domain
    console.log('gdpr/shop_redact', body, shop)
    return res.status(200).send({ message: 'ok' })
  } catch (e) {
    const error = e as Error
    console.error(`---> /api/gdpr/shop_redact 发生错误: ${error.message}`, e)
    return res.status(500).send({ error: true })
  }
}

export default withMiddleware('verifyHmac')(handler)

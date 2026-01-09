import clientProvider from '@/utils/clientProvider'
import withMiddleware from '@/utils/middleware/withMiddleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    // GET, POST, PUT, DELETE
    console.log('仅在方法类型为 GET 时处理此请求')
    return res.status(405).send({ error: true })
  }
  try {
    console.log('请求来自结账扩展')

    if (!req.user_shop) {
      return res.status(400).send({ error: '未找到店铺' })
    }

    // 示例 GraphQL 请求
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop,
    })

    const response = await client.request(/* GraphQL */ `
      {
        shop {
          id
        }
      }
    `)

    return res.status(200).send({ content: '结账正在工作' })
  } catch (e) {
    const error = e as Error
    console.error(`---> /api/checkout/index 发生错误: ${error.message}`, e)
    return res.status(403).send({ error: true })
  }
}

export default withMiddleware('verifyCheckout')(handler)

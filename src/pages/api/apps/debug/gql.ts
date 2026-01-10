import clientProvider from '@/server/shopify/client'
import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      })
      const shop = await client.request(/* GraphQL */ `
        {
          shop {
            name
          }
        }
      `)
      return res.status(200).send({ text: shop.data.shop.name })
    } catch (e) {
      console.error(`---> An error occured`, e)
      return res.status(400).send({ text: 'Bad request' })
    }
  } else {
    res.status(400).send({ text: 'Bad request' })
  }
}

export default withMiddleware('verifyRequest')(handler)

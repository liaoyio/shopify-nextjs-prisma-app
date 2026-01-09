import clientProvider from '@/utils/clientProvider'
import withMiddleware from '@/utils/middleware/withMiddleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      if (!req.user_shop) {
        return res.status(400).send({ error: 'Shop not found' })
      }

      const { client } = await clientProvider.offline.graphqlClient({
        shop: req.user_shop,
      })

      const activeWebhooks = await client.request(/* GraphQL */ `
        {
          webhookSubscriptions(first: 25) {
            edges {
              node {
                topic
                endpoint {
                  __typename
                  ... on WebhookHttpEndpoint {
                    callbackUrl
                  }
                }
              }
            }
          }
        }
      `)
      return res.status(200).send(activeWebhooks)
    } catch (e) {
      console.error(`---> An error occured`, e)
      return res.status(400).send({ text: 'Bad request' })
    }
  } else {
    res.status(400).send({ text: 'Bad request' })
  }
}

export default withMiddleware('verifyRequest')(handler)

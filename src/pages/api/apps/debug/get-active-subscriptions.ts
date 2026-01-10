import clientProvider from '@/utils/client-provider'
import withMiddleware from '@/utils/middleware/with-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Hit the endpoint')

  if (!req.user_shop) {
    return res.status(400).send({ error: 'Shop not found' })
  }

  const { client } = await clientProvider.offline.graphqlClient({
    shop: req.user_shop,
  })

  const response = await client.request(/* GraphQL */ `
    {
      appInstallation {
        activeSubscriptions {
          name
          status
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  __typename
                  price {
                    amount
                    currencyCode
                  }
                  interval
                }
              }
            }
          }
          test
        }
      }
    }
  `)

  res.status(200).send(response)
}

export default withMiddleware('verifyRequest')(handler)

import clientProvider from '@/server/shopify/client'
import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.user_shop) {
    return res.status(400).send({ error: 'Shop not found' })
  }

  const { client } = await clientProvider.offline.graphqlClient({
    shop: req.user_shop,
  })

  const returnUrl = `${process.env.SHOPIFY_APP_URL}/?shop=${req.user_shop}`

  const planName = '$10.25 plan'
  const planPrice = 10.25 // Always a decimal

  const response = await client.request(
    /* GraphQL */ `
      mutation CreateSubscription(
        $name: String!
        $lineItems: [AppSubscriptionLineItemInput!]!
        $returnUrl: URL!
        $test: Boolean
      ) {
        appSubscriptionCreate(
          name: $name
          returnUrl: $returnUrl
          lineItems: $lineItems
          test: $test
        ) {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
            status
          }
        }
      }
    `,
    {
      variables: {
        name: planName,
        returnUrl,
        test: true,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: {
                  amount: planPrice,
                  currencyCode: 'USD',
                },
                interval: 'EVERY_30_DAYS',
              },
            },
          },
        ],
      },
    },
  )

  if (response.data.appSubscriptionCreate.userErrors.length > 0) {
    console.log(
      `--> Error subscribing ${req.user_shop} to plan:`,
      response.data.appSubscriptionCreate.userErrors,
    )
    res.status(400).send({ error: 'An error occured.' })
    return
  }

  res.status(200).send({
    confirmationUrl: `${response.data.appSubscriptionCreate.confirmationUrl}`,
  })
}

export default withMiddleware('verifyRequest')(handler)

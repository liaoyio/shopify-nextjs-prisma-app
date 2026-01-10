/* eslint-disable no-alert */
import type { TableData } from '@shopify/polaris'
import { Card, DataTable, Layout, Page, Text } from '@shopify/polaris'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

const OptionalScopes = () => {
  const router = useRouter()
  const [rows, setRows] = useState<(ReactNode | string)[][]>([])
  const [loading, setLoading] = useState(false)

  async function createRows() {
    const scopes = await window?.shopify?.scopes?.query()
    if (!scopes) return

    const rows: (ReactNode | string)[][] = [
      [
        <Text as="p" fontWeight="bold" key="granted">
          Granted
        </Text>,
        scopes.granted.join(', '),
      ],
      [
        <Text as="p" fontWeight="bold" key="required">
          Required
        </Text>,
        scopes.required.join(', '),
      ],
      [
        <Text as="p" fontWeight="bold" key="optional">
          Optional
        </Text>,
        scopes.optional.join(', '),
      ],
    ]

    setRows(rows)
  }

  useEffect(() => {
    createRows()
  }, [])

  async function requestScopes() {
    setLoading(true)
    try {
      const optionalScopesString
        = process.env.CONFIG_SHOPIFY_API_OPTIONAL_SCOPES
      if (!optionalScopesString) {
        alert('No optional scopes configured')
        return
      }
      const scopesArray = JSON.parse(optionalScopesString)?.split(
        ',',
      ) as string[]
      const response = await window?.shopify?.scopes?.request(scopesArray)
      if (response?.result === 'granted-all') {
        createRows()
      } else if (response?.result === 'declined-all') {
        alert('Declined optional scopes')
      }
    } catch (e) {
      alert(
        'Error occured while requesting scopes. Is the scope declared in your env?',
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Page
        title="Scopes"
        primaryAction={{
          content: 'Request optional scopes',
          loading,
          onAction: () => {
            requestScopes()
          },
        }}
        backAction={{
          onAction: () => {
            router.push('/debug')
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <DataTable
                rows={rows as TableData[][]}
                columnContentTypes={['text', 'text']}
                headings={[
                  <Text as="p" fontWeight="bold" key="type">
                    Type
                  </Text>,
                  <Text as="p" fontWeight="bold" key="scopes">
                    Scopes
                  </Text>,
                ]}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  )
}

export default OptionalScopes

import {
  Layout,
  Card,
  Page,
  BlockStack,
  Text,
  InlineStack,
  Button,
} from '@shopify/polaris'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const useDataFetcher = (
  initialState: string,
  url: string,
  options?: RequestInit,
) => {
  const [data, setData] = useState(initialState)

  const fetchData = async () => {
    setData('loading...')
    const result = await (await fetch(url, options)).json()
    setData(result.text)
  }

  return [data, fetchData] as const
}

const useUserInfoFetcher = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await (await fetch('/api/apps/user-info')).json()
      if (result.error) {
        setError(result.error)
        setUserInfo(null)
      } else {
        setUserInfo(result)
        setError(null)
      }
    } catch (e) {
      const err = e as Error
      setError(err.message)
      setUserInfo(null)
    } finally {
      setLoading(false)
    }
  }

  return [userInfo, loading, error, fetchUserInfo] as const
}

type DataCardProps = {
  method: string
  url: string
  data: string
  onRefetch: () => void
}

const DataCard = ({ method, url, data, onRefetch }: DataCardProps) => (
  <Layout.Section>
    <Card>
      <BlockStack gap="200">
        <Text as="p">
          {method}
          {' '}
          <code>{url}</code>
          :
          {' '}
          {data}
        </Text>
        <InlineStack align="end">
          <Button variant="primary" onClick={onRefetch}>
            Refetch
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  </Layout.Section>
)

type UserInfoCardProps = {
  userInfo: any
  loading: boolean
  error: string | null
  onRefetch: () => void
}

const UserInfoCard = ({
  userInfo,
  loading,
  error,
  onRefetch,
}: UserInfoCardProps) => (
  <Layout.Section>
    <Card>
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">
          GET
          {' '}
          <code>/api/apps/user-info</code>
        </Text>
        {loading && <Text as="p">Loading...</Text>}
        {error && (
          <Text as="p" tone="critical">
            Error:
            {' '}
            {error}
          </Text>
        )}
        {userInfo && !loading && (
          <BlockStack gap="200">
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                User Information:
              </Text>
              {userInfo.user ? (
                <BlockStack gap="050">
                  <Text as="p">
                    ID:
                    {userInfo.user.id}
                  </Text>
                  <Text as="p">
                    Email:
                    {userInfo.user.email}
                  </Text>
                  <Text as="p">
                    Name:
                    {' '}
                    {userInfo.user.firstName}
                    {' '}
                    {userInfo.user.lastName}
                  </Text>
                  <Text as="p">
                    Locale:
                    {userInfo.user.locale}
                  </Text>
                  <Text as="p">
                    Account Owner:
                    {' '}
                    {userInfo.user.accountOwner ? 'Yes' : 'No'}
                  </Text>
                  <Text as="p">
                    Email Verified:
                    {' '}
                    {userInfo.user.emailVerified ? 'Yes' : 'No'}
                  </Text>
                  <Text as="p">
                    Collaborator:
                    {' '}
                    {userInfo.user.collaborator ? 'Yes' : 'No'}
                  </Text>
                </BlockStack>
              ) : (
                <Text as="p" tone="subdued">
                  No user information available (offline session)
                </Text>
              )}
            </BlockStack>
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                Session Information:
              </Text>
              <BlockStack gap="050">
                <Text as="p">
                  Shop:
                  {userInfo.session.shop}
                </Text>
                <Text as="p">
                  Session Type:
                  {' '}
                  {userInfo.session.isOnline ? 'Online' : 'Offline'}
                </Text>
                <Text as="p">
                  Scope:
                  {userInfo.session.scope}
                </Text>
                <Text as="p">
                  Expires:
                  {' '}
                  {userInfo.session.expires
                    ? new Date(userInfo.session.expires).toLocaleString()
                    : 'Never'}
                </Text>
              </BlockStack>
            </BlockStack>
            <BlockStack gap="100">
              <Text as="h3" variant="headingSm">
                Raw JSON:
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </Text>
            </BlockStack>
          </BlockStack>
        )}
        <InlineStack align="end">
          <Button variant="primary" onClick={onRefetch} loading={loading}>
            Refetch
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  </Layout.Section>
)

const GetData = () => {
  const router = useRouter()

  const postOptions: RequestInit = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ text: 'Body of POST request' }),
  }

  const [responseData, fetchContent] = useDataFetcher('', '/api/apps/debug')
  const [responseDataPost, fetchContentPost] = useDataFetcher(
    '',
    '/api/apps/debug',
    postOptions,
  )
  const [responseDataGQL, fetchContentGQL] = useDataFetcher(
    '',
    '/api/apps/debug/gql',
  )
  const [userInfo, userInfoLoading, userInfoError, fetchUserInfo]
    = useUserInfoFetcher()

  useEffect(() => {
    fetchContent()
    fetchContentPost()
    fetchContentGQL()
    fetchUserInfo()
  }, [])

  return (
    <Page
      title="Data Fetching"
      subtitle="Make an authenticated GET, POST and GraphQL request to the apps backend"
      backAction={{ onAction: () => router.push('/debug') }}
    >
      <Layout>
        <DataCard
          method="GET"
          url="/api/apps"
          data={responseData}
          onRefetch={fetchContent}
        />
        <DataCard
          method="POST"
          url="/api/apps"
          data={responseDataPost}
          onRefetch={fetchContentPost}
        />
        <DataCard
          method="GET"
          url="/api/apps/debug/gql"
          data={responseDataGQL}
          onRefetch={fetchContentGQL}
        />
        <UserInfoCard
          userInfo={userInfo}
          loading={userInfoLoading}
          error={userInfoError}
          onRefetch={fetchUserInfo}
        />
      </Layout>
    </Page>
  )
}

export default GetData

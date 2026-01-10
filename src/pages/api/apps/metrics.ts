import withMiddleware from '@/server/middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

type WebVitals = {
  INP: number
  FID: number
  CLS: number
  LCP: number
  FCP: number
  TTFB: number
}

type Metric = {
  name: keyof WebVitals
  value: string
}

/**
 * @param req - HTTP 请求对象。
 * @param res - HTTP 响应对象。
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    // GET, POST, PUT, DELETE
    console.log('仅在请求方法为 GET 时提供此服务')
    return res.status(405).send({ error: true })
  }

  try {
    if (!req.user_session) {
      return res.status(401).send({ error: '未授权' })
    }

    const webVitals: WebVitals = {
      INP: 0.0,
      FID: 0.0,
      CLS: 0.0,
      LCP: 0.0,
      FCP: 0.0,
      TTFB: 0.0,
    };
    (req.body?.metrics as Metric[])?.forEach((metr) => {
      if (metr?.name && metr?.value) {
        webVitals[metr.name] = Number(Number.parseFloat(metr.value).toFixed(2))
      }
    })

    // 注意: 您需要在 Prisma schema 中添加 metrics 模型才能使用此端点
    // 示例 schema:
    // model metrics {
    //   id        String   @id @default(uuid())
    //   shop      String
    //   appLoadId String?
    //   INP       Float?
    //   FID       Float?
    //   CLS       Float?
    //   LCP       Float?
    //   FCP       Float?
    //   TTFB      Float?
    //   raw_json  String?  @db.Text
    //   createdAt DateTime @default(now())
    // }
    // 添加 metrics 模型后取消注释以下行:
    // const writeMetrics = await prisma.metrics.create({
    //   data: {
    //     shop: req.user_session.shop,
    //     appLoadId: req.body.appLoadId,
    //     INP: webVitals?.INP,
    //     FID: webVitals?.FID,
    //     CLS: webVitals?.CLS,
    //     LCP: webVitals?.LCP,
    //     FCP: webVitals?.FCP,
    //     TTFB: webVitals?.TTFB,
    //     raw_json: JSON.stringify(req.body),
    //   },
    // });

    return res.status(200).send({ text: '成功！' })
  } catch (e) {
    console.error('---> /api/apps/ 发生错误', e)
    return res.status(403).send({ error: true })
  }
}

export default withMiddleware('verifyRequest')(handler)

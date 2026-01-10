import 'dotenv/config'
import { PrismaClient } from '~/prisma/client/client'
import type { PrismaClient as PrismaClientType } from '~/prisma/client/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString: connectionString || '' })
const prisma = new PrismaClient({ adapter }) as PrismaClientType

export default prisma

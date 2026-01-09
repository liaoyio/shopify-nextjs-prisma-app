import "dotenv/config";
import { PrismaClient } from "~/prisma/client/client";
import type { PrismaClient as PrismaClientType } from "~/prisma/client/client";

const connectionString = process.env.DATABASE_URL;

//PostgreSQL
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: connectionString || "" });

//MySQL
/*
 * 1. 注释掉上面的 PostgreSQL 设置
 * 2. 将 `/prisma/schema.prisma` 中的 provider 更改为 provider = "mysql"
 * 3. 安装 MySQL 驱动并卸载 PostgreSQL:
 *   `npm install @prisma/adapter-mariadb; npm uninstall pg @prisma/adapter-pg`
 * 或
 *   `bun install @prisma/adapter-mariadb; bun uninstall pg @prisma/adapter-pg`
 */

// const regex = /^mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)$/;
// const match = connectionString.match(regex);
// if (!match) {
//   throw new Error("无效的 DATABASE_URL");
// }

// const [, user, password, host, port, database] = match;

// const adapter = new PrismaMariaDb({
//   user,
//   password,
//   database,
//   host,
//   port: Number(port),
//   connectionLimit: 5, //adjust this if necessary
// });

const prisma = new PrismaClient({ adapter }) as PrismaClientType;

export default prisma;

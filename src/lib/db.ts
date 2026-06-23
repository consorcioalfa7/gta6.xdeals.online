import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

/**
 * Cliente Prisma com adapter libSQL.
 *
 * - Local (dev): DATABASE_URL="file:./db/custom.db" → abre SQLite local.
 * - Produção (Vercel/Turso): DATABASE_URL="libsql://<db>.turso.io"
 *   + DATABASE_AUTH_TOKEN="<token>" → conecta via HTTP (serverless-friendly).
 *
 * O SQLite com arquivo local NÃO funciona no Vercel serverless porque o
 * filesystem é efêmero/somente leitura. O Turso (libSQL over HTTP) resolve
 * isso mantendo o mesmo schema SQLite.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? 'file:./db/custom.db'
  const authToken = process.env.DATABASE_AUTH_TOKEN // undefined p/ file local

  const libsql = createClient({
    url,
    authToken: authToken && authToken.length > 0 ? authToken : undefined,
  })
  const adapter = new PrismaLibSql(libsql)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

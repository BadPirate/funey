import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

// Use DATABASE_URL env var or fallback to local SQLite dev.db
let connectionString = process.env.DATABASE_URL || 'file:./dev.db'
// If using filesystem SQLite URL, convert to absolute file URL so paths resolve consistently
if (connectionString.startsWith('file:')) {
  const filePath = connectionString.replace(/^file:(?:\/\/)?/, '')
  const absPath = path.resolve(process.cwd(), filePath)
  connectionString = 'file:' + absPath
}

/**
 * Prisma client instance configured at runtime.
 */
export const prisma = new PrismaClient({
  datasources: { db: { url: connectionString } },
})

/**
 * Create a new account with given id and view token.
 */
import crypto from 'crypto'

/**
 * Create a new account with given id and optional view token.
 * If view is not provided, generates a random 8-character hex token.
 */
export async function createAccount(id: string, view?: string) {
  const viewToken = view || crypto.randomBytes(4).toString('hex')
  return prisma.account.create({
    data: { id, view: viewToken },
  })
}

/**
 * Add a transaction to an account.
 */
export async function addTransaction(
  accountId: string,
  description: string,
  value: number,
  isInterest = false,
  ts: Date = new Date(),
  isAllowance = false,
) {
  return prisma.transaction.create({
    data: {
      account: accountId,
      description,
      value,
      is_interest: isInterest,
      is_allowance: isAllowance,
      ts,
    },
  })
}

/**
 * Fetch account info by id or view token, including computed balance.
 */
export async function getAccountInfo(idOrView: string): Promise<{
  interest: number
  view: string
  allowance: number
  value: number
  id: string
} | null> {
  const account = await prisma.account.findFirst({
    where: { OR: [{ id: idOrView }, { view: idOrView }] },
  })
  if (!account) {
    return null
  }
  const sumResult = await prisma.transaction.aggregate({
    where: { account: account.id },
    _sum: { value: true },
  })
  const value = sumResult._sum.value ?? 0
  return {
    id: account.id,
    interest: account.interest,
    view: account.view,
    allowance: account.allowance,
    value,
  }
}

/**
 * Fetch recent transactions (up to 20) for account or view token.
 */
export async function getTransactions(
  idOrView: string,
): Promise<{ id: number; description: string; ts: number; value: number }[]> {
  // Determine the actual account ID
  let accountId = idOrView
  const byId = await prisma.account.findUnique({ where: { id: idOrView } })
  if (!byId) {
    const byView = await prisma.account.findUnique({ where: { view: idOrView } })
    if (!byView) {
      return []
    }
    accountId = byView.id
  }
  const trs = await prisma.transaction.findMany({
    where: { account: accountId },
    orderBy: { ts: 'desc' },
    take: 20,
  })
  return trs.map((t) => ({
    id: t.id,
    description: t.description,
    ts: Math.floor(t.ts.getTime() / 1000),
    value: t.value,
  }))
}

/**
 * Update monthly interest by adding interest transactions until up to date.
 */
import moment from 'moment'
export async function updateInterest(idOrView: string): Promise<void> {
  const acct = await getAccountInfo(idOrView)
  if (!acct || acct.value <= 0) return
  const accountId = acct.id
  const firstTx = await prisma.transaction.findFirst({
    where: { account: accountId },
    orderBy: { ts: 'asc' },
    select: { ts: true },
  })
  const lastInterest = await prisma.transaction.findFirst({
    where: { account: accountId, is_interest: true },
    orderBy: { ts: 'desc' },
    select: { ts: true },
  })
  const start = lastInterest?.ts || firstTx?.ts
  if (!start) return
  const next = new Date(start)
  next.setMonth(next.getMonth() + 1)
  if (next > new Date()) return
  // interest applied on sum at that time
  const result = await prisma.transaction.aggregate({
    where: { account: accountId },
    _sum: { value: true },
  })
  const sum = result._sum.value ?? 0
  await addTransaction(accountId, 'Interest payment', sum * acct.interest, true, next)
  // recurse to catch up multiple months
  return updateInterest(idOrView)
}

/**
 * Update weekly allowance by adding allowance transactions until up to date.
 */
export async function updateAllowance(idOrView: string): Promise<void> {
  const acct = await getAccountInfo(idOrView)
  if (!acct || acct.allowance <= 0) return
  const accountId = acct.id
  const lastAllowance = await prisma.transaction.findFirst({
    where: { account: accountId, is_allowance: true },
    orderBy: { ts: 'desc' },
    select: { ts: true },
  })
  let next: Date
  if (!lastAllowance) {
    // first allowance on last Sunday or today if Sunday
    next = moment().day() === 0 ? moment().toDate() : moment().day(-7).toDate()
  } else {
    next = moment(lastAllowance.ts).add(7, 'days').toDate()
  }
  if (next > new Date()) return
  await addTransaction(accountId, 'Allowance', acct.allowance, false, next, true)
  // recurse to catch up weeks
  return updateAllowance(idOrView)
}

/**
 * Update account settings (interest and allowance).
 */
export async function updateAccountSettings(id: string, interest: number, allowance: number) {
  return prisma.account.update({
    where: { id },
    data: { interest, allowance },
  })
}

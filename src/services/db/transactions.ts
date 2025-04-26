import prisma from './client'
import { Transaction } from '@/src/types'

/**
 * Add a transaction to an account.
 */
async function addTransaction(
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
 * Fetch recent transactions (up to 20) for account or view token.
 */
async function getTransactions(
  idOrView: string,
): Promise<{ id: number; description: string; ts: number; value: number }[]> {
  // Determine the actual account ID
  let accountId = idOrView
  const byId = await prisma.account.findUnique({ where: { id: idOrView } })
  if (!byId) {
    // Using findFirst instead of findUnique since view might not be a unique field
    const byView = await prisma.account.findFirst({ where: { view: idOrView } })
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
  return trs.map((t: Transaction) => ({
    id: t.id,
    description: t.description,
    ts: t.ts,
    value: t.value,
  }))
}

const transactionService = {
  addTransaction,
  getTransactions,
}

export default transactionService

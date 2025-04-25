import crypto from 'crypto'
import prisma from './client'

/**
 * Create a new account with given id and optional view token.
 * If view is not provided, generates a random 8-character hex token.
 */
async function createAccount(id: string, view?: string) {
  const viewToken = view || crypto.randomBytes(4).toString('hex')
  return prisma.account.create({
    data: { id, view: viewToken },
  })
}

/**
 * Get a user account by id.
 */
async function getUser(id: string) {
  return prisma.account.findUnique({ where: { id } })
}

/**
 * Create a new user account.
 */
async function createUser(id: string, _username: string) {
  return createAccount(id)
}

/**
 * Fetch account info by id or view token, including computed balance.
 */
async function getAccountInfo(idOrView: string): Promise<{
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
 * Update account settings (interest and allowance).
 */
async function updateAccountSettings(id: string, interest: number, allowance: number) {
  return prisma.account.update({
    where: { id },
    data: { interest, allowance },
  })
}

const accountService = {
  createAccount,
  getUser,
  createUser,
  getAccountInfo,
  updateAccountSettings,
}

export default accountService

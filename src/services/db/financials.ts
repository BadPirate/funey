import moment from 'moment'
import accountService from './accounts'
import transactionService from './transactions'

/**
 * Update monthly interest by adding interest transactions until up to date.
 */
async function updateInterest(idOrView: string): Promise<void> {
  const acct = await accountService.getAccountInfo(idOrView)
  if (!acct || acct.value <= 0) return

  const accountId = acct.id
  const firstTx = await transactionService
    .getTransactions(accountId)
    .then((txs) => (txs.length > 0 ? { ts: new Date(txs[txs.length - 1].ts * 1000) } : null))

  // Find the last interest transaction
  const lastInterestTxs = await transactionService
    .getTransactions(accountId)
    .then((txs) => txs.filter((tx) => tx.description === 'Interest payment'))

  const lastInterest =
    lastInterestTxs.length > 0 ? { ts: new Date(lastInterestTxs[0].ts * 1000) } : null

  const start = lastInterest?.ts || firstTx?.ts
  if (!start) return

  const next = new Date(start)
  next.setMonth(next.getMonth() + 1)
  if (next > new Date()) return

  // interest applied on sum at that time
  await transactionService.addTransaction(
    accountId,
    'Interest payment',
    acct.value * acct.interest,
    true,
    next,
  )

  // recurse to catch up multiple months
  return updateInterest(idOrView)
}

/**
 * Update weekly allowance by adding allowance transactions until up to date.
 */
async function updateAllowance(idOrView: string): Promise<void> {
  const acct = await accountService.getAccountInfo(idOrView)
  if (!acct || acct.allowance <= 0) return

  const accountId = acct.id

  // Find the last allowance transaction
  const lastAllowanceTxs = await transactionService
    .getTransactions(accountId)
    .then((txs) => txs.filter((tx) => tx.description === 'Allowance'))

  const lastAllowance =
    lastAllowanceTxs.length > 0 ? { ts: new Date(lastAllowanceTxs[0].ts * 1000) } : null

  let next: Date
  if (!lastAllowance) {
    // first allowance on last Sunday or today if Sunday
    next = moment().day() === 0 ? moment().toDate() : moment().day(-7).toDate()
  } else {
    next = moment(lastAllowance.ts).add(7, 'days').toDate()
  }

  if (next > new Date()) return

  await transactionService.addTransaction(accountId, 'Allowance', acct.allowance, false, next, true)

  // recurse to catch up weeks
  return updateAllowance(idOrView)
}

const financialService = {
  updateInterest,
  updateAllowance,
}

export default financialService

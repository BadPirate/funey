import accountService from './accounts'
import transactionService from './transactions'
import financialService from './financials'
import prisma from './client'

const db = {
  // Re-export the individual services
  ...accountService,
  ...transactionService,
  ...financialService,
  // Also expose the prisma client for direct access if needed
  prisma,
}

export default db

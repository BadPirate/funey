import type { NextApiRequest, NextApiResponse } from 'next'
import transactionService from '../../../../src/services/db/transactions'

type TransactionRequest = NextApiRequest & {
  body: {
    amount: string | number
    description: string
    action: 'add' | 'subtract'
  }
  query: {
    userid?: string | string[]
  }
}

export default async function handler(req: TransactionRequest, res: NextApiResponse) {
  const { amount: amtRaw, description, action } = req.body
  const rawUserId = req.query.userid
  const userid = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId
  if (!userid) {
    res.status(400).send('Unknown user')
    return
  }
  // Use Prisma to add transaction
  let amount = typeof amtRaw === 'string' ? parseFloat(amtRaw) : amtRaw
  if (action === 'subtract' && amount > 0) {
    amount = -amount
  } else if (amount < 0) {
    amount = -amount
  }
  // Attempt to create the transaction
  try {
    const result = await transactionService.addTransaction(userid, description, amount)
    return res.status(201).json({ message: 'Transaction created', result })
  } catch (error) {
    // Log the error for debugging
    console.error('Failed to create transaction:', error)
    return res.status(500).json({ error: 'Failed to create transaction' })
  }
}

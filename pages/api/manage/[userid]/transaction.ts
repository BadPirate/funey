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
  let amount = Math.abs(typeof amtRaw === 'string' ? parseFloat(amtRaw) : amtRaw)
  if (action === 'subtract') {
    amount = -amount
  }
  // Attempt to create the transaction
  try {
    await transactionService.addTransaction(userid, description, amount)
    // If the request is a form POST, redirect to the manage page
    if (req.method === 'POST') {
      res.redirect(303, `/manage/${userid}`)
      return
    }
    // For non-form requests, return JSON (for API/AJAX use)
    return res.status(201).json({ message: 'Transaction created' })
  } catch (error) {
    // Log the error for debugging
    console.error('Failed to create transaction:', error)
    return res.status(500).json({ error: 'Failed to create transaction' })
  }
}

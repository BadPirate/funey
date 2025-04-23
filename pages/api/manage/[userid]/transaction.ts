import type { NextApiRequest, NextApiResponse } from 'next'
import { addTransaction } from '../../../../src/db'

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
  try {
    await addTransaction(userid, description, amount)
    res.redirect(302, `/manage/${userid}`)
  } catch (error) {
    res.status(500).send('Error processing transaction')
  }
}

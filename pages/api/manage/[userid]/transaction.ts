import type { NextApiRequest, NextApiResponse } from 'next'
import { newClient, addTransaction } from '../../../../src/FuneyPG'

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
  const client = await newClient()
  let amount = typeof amtRaw === 'string' ? parseFloat(amtRaw) : amtRaw
  if (action === 'subtract' && amount > 0) {
    amount = -amount
  } else if (amount < 0) {
    amount = -amount
  }
  try {
    await addTransaction(client, userid, description, amount)
    res.redirect(302, `/manage/${userid}`)
  } catch (error) {
    res.status(500).send('Error processing transaction')
  } finally {
    await client.end()
  }
}

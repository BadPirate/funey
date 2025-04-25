import type { NextApiRequest, NextApiResponse } from 'next'
import accountService from '../../../../src/services/db/accounts'

type UpdateRequest = NextApiRequest & {
  body: {
    interest: string
    allowance: string
  }
  query: {
    userid?: string | string[]
  }
}

export default async function handler(req: UpdateRequest, res: NextApiResponse) {
  const { interest: interestRaw, allowance: allowanceRaw } = req.body
  const rawUserId = req.query.userid
  const userid = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId
  if (!userid) {
    res.status(400).send('Unknown user')
    return
  }
  const interest = parseFloat(interestRaw)
  const allowance = parseFloat(allowanceRaw)
  try {
    const result = await accountService.updateAccountSettings(userid, interest, allowance)
    return res.status(200).json({ message: 'User info updated', result })
  } catch (error) {
    // Log the error for debugging
    console.error('Failed to update user info:', error)
    return res.status(500).json({ error: 'Failed to update user info' })
  }
}

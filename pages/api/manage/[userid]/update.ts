import type { NextApiRequest, NextApiResponse } from 'next'
import { updateAccountSettings } from '../../../../src/db'

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
    await updateAccountSettings(userid, interest, allowance)
    res.redirect(302, `/manage/${userid}`)
  } catch (error) {
    res.status(500).send('Error updating account')
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256'
import crypto from 'crypto'
import { createAccount, addTransaction } from '../../src/db'

type CreateRequest = NextApiRequest & {
  body: {
    user: string
    pass: string
    pass2: string
  }
}

export default async function handler(req: CreateRequest, res: NextApiResponse) {
  const { user, pass, pass2 } = req.body
  if (pass !== pass2) {
    res.status(400).send("Passwords do't match")
    return
  }
  const shaKey = sha256(`${user}&&${pass}`)
  try {
    // Create account and initial setup transaction
    const account = await createAccount(shaKey)
    await addTransaction(account.id, 'Initial Setup', 0)
    res.redirect(302, `/manage/${shaKey}`)
  } catch (error: any) {
    // Prisma unique constraint error code P2002
    if (error.code === 'P2002') {
      res.status(409).send('Account already exists.')
    } else {
      res.status(500).send(`Error - ${error.message}`)
    }
  }
}

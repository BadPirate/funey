// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256'
import { newClient } from '../../src/FuneyPG'

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
  const client = await newClient()
  const shaKey = sha256(`${user}&&${pass}`)
  try {
    await client.query('INSERT INTO accounts (id) VALUES (?)', [shaKey])
    await client.query(
      `INSERT INTO transactions (account, description, value) VALUES (?, 'Initial Setup', 0)`,
      [shaKey],
    )
    await client.end()
    res.redirect(302, `/manage/${shaKey}`)
  } catch (error: any) {
    await client.end()
    if (error.code === '23505') {
      res.status(409).send('Account already exists.')
    } else {
      res.status(500).send(`Error - ${(error.detail as string) || error.message}`)
    }
  }
}

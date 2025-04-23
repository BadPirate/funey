import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256'

type LoginRequest = NextApiRequest & {
  body: {
    user: string
    pass: string
  }
}

export default function handler(req: LoginRequest, res: NextApiResponse) {
  const { user, pass } = req.body
  const userid = sha256(`${user}&&${pass}`)
  res.redirect(302, `/manage/${userid}`)
}

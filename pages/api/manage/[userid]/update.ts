import type { NextApiRequest, NextApiResponse } from 'next'
import newClient from '../../../../src/FuneyPG'

export default async function Update(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const {
    body: {
      interest,
      allowance,
    },
    query: {
      userid,
    },
  } = req

  if (!userid) {
    res.status(500).send('Unknown user')
    return
  }

  const client = await newClient()

  await client.query('UPDATE accounts SET interest = $2, allowance = $3 WHERE id = $1', [userid, interest, allowance])
    .catch((error) => {
      res.status(500).send('Error :(')
    })
    .then(() => {
      res.redirect(`/manage/${userid}`)
    })
    .finally(() => client.end())
}

import type { NextApiRequest, NextApiResponse } from 'next'
import newClient, { addTransaction } from '../../../../src/FuneyPG'

export default async function Update(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const {
    body: {
      amount,
      description,
      action,
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

  let finalAmount = Number(amount)
  if (action === 'subtract' && finalAmount > 0) {
    finalAmount *= -1
  } else if (finalAmount < 0) {
    finalAmount *= -1
  }

  await addTransaction(client, userid as string, description, finalAmount)
    .catch((error) => {
      res.status(500).send('Error :(')
    })
    .then(() => {
      res.redirect(`/manage/${userid}`)
    })
    .finally(() => client.end())
}

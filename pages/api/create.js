// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sha256 from "sha256"
import newClient from "../../src/newClient"

export default async function Create(req, res) {
  let {
    body : {
      pass,
      pass2,
      user
    }
  } = req

  if (pass != pass2) {
    res.status(500).send("Passwords don't match")
    return
  }

  let client = await newClient()

  let keyBase = user + "&&" + pass
  let shaKey = sha256(keyBase)

  const pgres = await client.query('INSERT INTO accounts (id) VALUES ($1::text)', [shaKey])
  .catch( error => {
    if (error.code == 23505) {
      res.status(500).send("Account already exists.")
      return
    }
    res.status(500).send(`Error - ${error.detail}`)
  })
  .then( () => {
    res.redirect(`/manage/${shaKey}`)
  })
  .finally( () => {
    client.end()
  })
}


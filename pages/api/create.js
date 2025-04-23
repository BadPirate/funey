// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sha256 from "sha256"
import newClient from "../../src/FuneyPG"

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

  await client.query('INSERT INTO accounts (id) VALUES (?)', [shaKey])
  .catch( error => {
    if (error.code == 23505) {
      res.status(500).send("Account already exists.")
      return
    }
    res.status(500).send(`Error - ${error.detail}`)
  })
  await client.query(`
  INSERT INTO transactions (account, description, value) VALUES (?, 'Initial Setup', 0)`,
  [shaKey])
  client.end()
  res.redirect(302, `/manage/${shaKey}`)
}


import sha256 from 'sha256'

export default async function Create(req, res) {
  const {
    body: {
      pass,
      user,
    },
  } = req

  const keyBase = `${user}&&${pass}`
  const userid = sha256(keyBase)

  res.redirect(`/manage/${userid}`)
}

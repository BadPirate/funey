import sha256 from "sha256"

export default async function Create(req, res) {
    let {
      body : {
        pass,
        user
      }
    } = req

    let keyBase = user + "&&" + pass
    let userid = sha256(keyBase)

    res.redirect(302, `/manage/${userid}`)
}
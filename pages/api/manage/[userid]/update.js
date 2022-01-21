import newClient from "../../../../src/FuneyPG"

export default async function Update(req, res) {
    const {
        body : {
            interest
        },
        query : {
            userid
        }
    } = req

    if (!userid) {
        res.status(500).send("Unknown user")
        return
    }

    let client = await newClient()

    await client.query('UPDATE accounts SET interest = $2 WHERE id = $1', [userid, interest])
    .catch( (error) => {
        console.log("ERROR",error)
        res.status(500).send("Error :(")
    })
    .then(() => {
        res.redirect(`/manage/${userid}`)
    })
    .finally( () => client.end())
}
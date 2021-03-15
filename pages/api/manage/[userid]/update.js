import newClient from "../../../../src/newClient"

export default async function Update(req, res) {
    const {
        body : {
            value,
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

    await client.query('UPDATE accounts SET value = $1, interest = $3 WHERE id = $2', [value, userid, interest])
    .catch( (error) => {
        console.log("ERROR",error)
        res.status(500).send("Error :(")
    })
    .then(() => {
        res.redirect(`/manage/${userid}`)
    })
    .finally( () => client.end())
}
import newClient, { addTransaction } from "../../../../src/FuneyPG"

export default async function Update(req, res) {
    var {
        body : {
            amount,
            description,
            action
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

    if (action == 'subtract' && amount > 0) {
        amount = amount * -1
    } else if (amount < 0) {
        amount = amount * -1
    }

    await addTransaction(client, userid, description, amount)
    .catch( (error) => {
        console.log("ERROR",error)
        res.status(500).send("Error :(")
    })
    .then(() => {
        res.redirect(`/manage/${userid}`)
    })
    .finally( () => client.end())
}
import { Card } from "react-bootstrap";
import newClient from "../../src/newClient"
import updateInterest from "../../src/updateInterest";

const View = ({account: {value}}) => {
    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Your Money
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Title className="text-center">
                    {`$${value.toFixed(2)}`}
                </Card.Title>
            </Card.Body>
        </Card>
    )
}

export async function getServerSideProps({query: {viewid}}) {
    const client = await newClient()
    let props = { viewid }

    await client.query('SELECT value, interest, next FROM accounts WHERE view = $1::text',[viewid])
    .then((result) => {
        props.account = result.rows[0]
    })
    .catch((error) => {
        props.error = JSON.stringify(error)
    })

    if (!props.account) {
        return { props }
    }

    let {
        account : {
            next,
            value,
            interest
        }
    } = props

    props = await updateInterest(next, client, viewid, props, value, interest);

    client.end()
    delete props.account.next
    return { props }
}


export default View



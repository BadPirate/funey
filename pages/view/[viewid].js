import { Card } from "react-bootstrap";
import newClient, { getAccountInfo, getTransactions } from "../../src/FuneyPG"
import TransactionsCard from "../../src/TransactionsCard";
import updateInterest, { updateAllowance } from "../../src/updateInterest";

const View = ({account: {value}, transactions}) => {
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
                <TransactionsCard transactions={transactions}/>
            </Card.Body>
        </Card>
    )
}

export async function getServerSideProps({query: {viewid}}) {
    const client = await newClient()
    let props = { viewid }

    await getAccountInfo(client, props, viewid)
    await updateInterest(client, viewid)
    await updateAllowance(client, viewid)
    await getTransactions(client, props, viewid)

    client.end()

    return { props }
}


export default View



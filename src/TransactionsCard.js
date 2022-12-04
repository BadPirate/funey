import { useState } from "react"
import { Button, Table } from "react-bootstrap"

const TransactionsCard = ({transactions}) => {
    const [expand, setExpand] = useState(false)
    const showTransactions = expand ? transactions : transactions.slice(0,4) 
    return (<div className="mb-3">
        <h2>Transactions:</h2>
        <Table>
            <tbody>
            {
                showTransactions.map(({ts, value, description}) => {
                    const date = new Date(ts*1000)
                    return (
                        <tr>
                            <td>{date.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}) }</td>
                            <td>{description}</td>
                            <td>{value >= 0 ? `\$${value.toFixed(2)}` : `\- $${-(value).toFixed(2)}`}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
        {!expand && transactions.length > 5 ? <Button onClick={() => setExpand(true)}>Show All</Button> : null}
    </div>)
}

export default TransactionsCard
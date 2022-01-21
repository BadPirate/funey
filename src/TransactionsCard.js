import { useState } from "react"
import { Table } from "react-bootstrap"

const TransactionsCard = ({transactions}) => {
    return (<div>
        <h2>Transactions:</h2>
        <Table>
            <tbody>
            {
                transactions.map(({ts, value, description}) => {
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
    </div>)
}

export default TransactionsCard
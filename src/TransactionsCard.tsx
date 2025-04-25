import React, { useState } from 'react'
import { Button, Table } from 'react-bootstrap'

interface Transaction {
  ts: string | number
  value: number
  description: string
}

interface TransactionsCardProps {
  transactions: Transaction[]
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({ transactions }) => {
  const [expand, setExpand] = useState<boolean>(false)
  const showTransactions = expand ? transactions : transactions.slice(0, 4)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace('$', '')
      .replace('-', '')
  }

  return (
    <div className="mb-3">
      <h2>Transactions:</h2>
      <Table>
        <tbody>
          {showTransactions.map(({ ts, value, description }, index) => {
            const date = new Date(Number(ts) * 1000)
            const utcStr = date.toLocaleDateString('en-us', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC',
            })
            return (
              <tr key={`${ts}-${index}`}>
                <td>{utcStr}</td>
                <td>{description}</td>
                <td>{value >= 0 ? `$${formatCurrency(value)}` : `- $${formatCurrency(-value)}`}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {!expand && transactions.length > 5 ? (
        <Button onClick={() => setExpand(true)}>Show All</Button>
      ) : null}
    </div>
  )
}

export default TransactionsCard

import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Card } from 'react-bootstrap'
import type { Transaction, Account } from '../../src/types'
import accountService from '../../src/services/db/accounts'
import transactionService from '../../src/services/db/transactions'
import financialService from '../../src/services/db/financials'
import TransactionsCard from '../../src/TransactionsCard'

interface ViewProps {
  account: Account | null
  transactions: Transaction[]
}

const View: NextPage<ViewProps> = ({ account, transactions }) => {
  if (!account) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Account Not Found</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>This account view link is invalid or has been removed.</p>
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Your Money</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">{`$${account.value.toFixed(2)}`}</Card.Title>
        <TransactionsCard transactions={transactions} />
      </Card.Body>
    </Card>
  )
}

export const getServerSideProps: GetServerSideProps<ViewProps> = async ({ query }) => {
  const { viewid } = query
  const id = Array.isArray(viewid) ? viewid[0] : viewid
  const props: ViewProps = { account: null, transactions: [] }
  if (id) {
    await financialService.updateInterest(id)
    await financialService.updateAllowance(id)
    const account = await accountService.getAccountInfo(id)
    if (account) {
      const transactions = await transactionService.getTransactions(id)
      props.account = account
      props.transactions = transactions
    }
  }
  return { props }
}

export default View

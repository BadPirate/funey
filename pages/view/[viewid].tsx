import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import type { Transaction, Account } from '../../src/types'
import { Card } from 'react-bootstrap'
import { getAccountInfo, getTransactions, updateInterest, updateAllowance } from '../../src/db'
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
    await updateInterest(id)
    await updateAllowance(id)
    const account = await getAccountInfo(id)
    if (account) {
      const transactions = await getTransactions(id)
      props.account = account
      props.transactions = transactions
    }
  }
  return { props }
}

export default View

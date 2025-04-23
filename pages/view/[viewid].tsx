import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import type { Transaction, Account } from '../../src/types'
import { Card } from 'react-bootstrap'
import { newClient, getAccountInfo, getTransactions } from '../../src/FuneyPG'
import TransactionsCard from '../../src/TransactionsCard'
import { updateInterest, updateAllowance } from '../../src/updateInterest'

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
  const client = await newClient()
  const props: ViewProps = { account: null, transactions: [] }
  if (id) {
    await getAccountInfo(client, props, id)
    await updateInterest(client, id)
    await updateAllowance(client, id)
    await getTransactions(client, props, id)
  }
  await client.end()
  return { props }
}

export default View

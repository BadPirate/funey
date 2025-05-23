import React, { useEffect, useState } from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { Button, Card, Form, FormControl, InputGroup, Alert } from 'react-bootstrap'
import type { Transaction, Account } from '../../src/types'
import accountService from '../../src/services/db/accounts'
import transactionService from '../../src/services/db/transactions'
import financialService from '../../src/services/db/financials'
import TransactionsCard from '../../src/TransactionsCard'

interface ManageProps {
  userid: string
  transactions: Transaction[]
  account: Account
}

const Manage: NextPage<ManageProps> = ({ userid, transactions, account }) => {
  const { interest, value, view, allowance } = account
  const [hostname, setHostname] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <Card>
      <Card.Header>
        <Card.Title>Parent Account Management</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <h2>Account Balance: ${value.toFixed(2)}</h2>
        </div>
        <TransactionsCard transactions={transactions} />
        <Form method="POST" action={`/api/manage/${userid}/transaction`}>
          <InputGroup className="mb-3">
            <FormControl name="amount" type="number" step="0.01" placeholder="Amount" />
            <FormControl name="description" placeholder="Description" />
            <Button type="submit" name="action" value="subtract" variant="danger">
              Subtract
            </Button>
            <Button type="submit" name="action" value="add" variant="success">
              Add
            </Button>
          </InputGroup>
        </Form>
        <Form method="POST" action={`/api/manage/${userid}/update`}>
          <div className="mb-3">
            <h2>Interest</h2>
            <InputGroup>
              <FormControl name="interest" defaultValue={interest.toFixed(3)} />
            </InputGroup>
            <Form.Text>Interest is added monthly on the 1st.</Form.Text>
          </div>
          <div className="mb-3">
            <h2>Allowance</h2>
            <InputGroup>
              <FormControl name="allowance" defaultValue={allowance ? allowance.toFixed(3) : '0'} />
            </InputGroup>
            <Form.Text>Allowance is added weekly on Sunday</Form.Text>
          </div>
          <Button type="submit">Update</Button>
        </Form>
        <div className="mt-4">
          <h2>Kids View</h2>
          <p>Bookmark this link for view-only access:</p>
          <Alert
            className="text-center"
            variant="info"
            onClick={() => {
              navigator.clipboard.writeText(`https://${hostname}/view/${view}`)
              setCopied(true)
              setTimeout(() => setCopied(false), 3000)
            }}
          >
            {copied ? 'Copied' : `https://${hostname}/view/${view}`}
          </Alert>
        </div>
      </Card.Body>
    </Card>
  )
}

export const getServerSideProps: GetServerSideProps<ManageProps> = async ({ query }) => {
  const { userid } = query
  const id = Array.isArray(userid) ? userid[0] : userid
  if (!id) {
    return { notFound: true }
  }
  // Apply pending interest and allowance
  await financialService.updateInterest(id)
  await financialService.updateAllowance(id)
  // Fetch account and transactions
  const account = await accountService.getAccountInfo(id)
  if (!account) {
    return { notFound: true }
  }
  const transactions = await transactionService.getTransactions(id)
  return { props: { userid: id, account, transactions } }
}

export default Manage

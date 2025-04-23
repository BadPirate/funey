import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import {
  Button, Card, Form, FormControl, InputGroup, Alert,
} from 'react-bootstrap'
import { default as client, getAccountInfo, getTransactions } from '../../src/FuneyPG'
import TransactionsCard from '../../src/TransactionsCard.tsx'
import updateInterest, { updateAllowance } from '../../src/updateInterest'

interface AccountInfo {
  interest: number
  value: number
  view: string
  allowance: number
}

interface ManageProps {
  userid: string
  transactions: Array<{
    id: string
    description: string
    ts: number
    value: number
  }>
  account: AccountInfo
}

const Manage = ({
  userid, transactions, account: {
    interest, value, view, allowance,
  },
}: ManageProps) => {
  const [hostname, setHostname] = useState<string>()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <Card>
      <Card.Header>
        <Card.Title>Parent Account Management</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <h2>
            Account Balance: $
            {value.toFixed(2)}
          </h2>
        </Card.Text>
        <Card.Text>
          <TransactionsCard transactions={transactions} />
          <Form method="POST" action={`/api/manage/${userid}/transaction`}>
            <InputGroup>
              <FormControl name="amount" type="number" step=".01" placeholder="Amount" />
              <FormControl name="description" placeholder="Description" />
              <Button type="submit" name="action" value="subtract" variant="danger">Subtract</Button>
              <Button type="submit" name="action" value="add" variant="success">Add</Button>
            </InputGroup>
          </Form>
        </Card.Text>
      </Card.Body>
      <Card.Body>
        <Form method="POST" action={`/api/manage/${userid}/update`}>
          <h2>
            Interest:
            <InputGroup>
              <FormControl name="interest" defaultValue={interest.toFixed(3)} />
            </InputGroup>
          </h2>
          <Form.Text>Interest is added monthly on the 1st.</Form.Text>
          <h2>
            Allowance:
            <InputGroup>
              <FormControl name="allowance" defaultValue={allowance ? allowance.toFixed(3) : 0} />
            </InputGroup>
          </h2>
          <Form.Text>Allowance is added weekly on Sunday</Form.Text>
          <div><Button type="submit">Update</Button></div>
        </Form>
      </Card.Body>
      <Card.Body>
        <Card.Text>
          <h2>Kids View</h2>
          In order for your kid to see their account balance simply bookmark this page for them:
          <Alert
            className="text-center"
            variant="info"
            onClick={() => {
              navigator.clipboard.writeText(`https://${hostname}/view/${view}`)
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 3000)
            }}
          >
            {copied ? 'Copied' : `https://${hostname}/view/${view}`}
          </Alert>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query: { userid } }) => {
  const client = await newClient()
  const props: any = { userid }

  await getAccountInfo(client, props, userid as string)
    .then(() => updateInterest(client, userid as string))
    .then(() => updateAllowance(client, userid as string))
    .then(() => getTransactions(client, props, userid as string))

  client.end()

  return { props }
}

export default Manage

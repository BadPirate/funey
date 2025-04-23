import type { GetServerSideProps } from 'next'
import { Card } from 'react-bootstrap'
import newClient, { getAccountInfo, getTransactions } from '../../src/FuneyPG'
import TransactionsCard from '../../src/TransactionsCard'
import updateInterest, { updateAllowance } from '../../src/updateInterest'

interface ViewProps {
  account: {
    value: number
  }
  transactions: Array<{
    id: string
    description: string
    ts: number
    value: number
  }>
}

const View = ({ account: { value }, transactions }: ViewProps) => (
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
      <TransactionsCard transactions={transactions} />
    </Card.Body>
  </Card>
)

export const getServerSideProps: GetServerSideProps = async ({ query: { viewid } }) => {
  const client = await newClient()
  const props: any = { viewid }

  await getAccountInfo(client, props, viewid as string)
  await updateInterest(client, viewid as string)
  await updateAllowance(client, viewid as string)
  await getTransactions(client, props, viewid as string)

  client.end()

  return { props }
}

export default View


import { Client, QueryResult } from 'pg'

interface AccountProps {
  error?: Error
  account?: {
    interest: number
    view: string
    allowance: number
    value: number
  }
  transactions?: Array<{
    id: string
    description: string
    ts: number
    value: number
  }>
}

export async function newClient(): Promise<Client> {
  let client: Client
  if (process.env.PGHOST) {
    client = new Client({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      user: process.env.PGUSER,
      password: process.env.PGPASS,
      database: process.env.DB,
    })
  } else {
    client = new Client({
      connectionString: process.env.DOKKU_POSTGRES_AQUA_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  await client.connect()
  return client
}

export async function getAccountInfo(
  client: Client,
  props: AccountProps,
  userIdOrView: string
): Promise<void> {
  try {
    const result = await client.query(
      `
      SELECT 
        a.interest, a.view, a.allowance,
        (SELECT SUM(t.value) FROM transactions t WHERE t.account = a.id) as value
      FROM accounts a
      WHERE 
        a.id = $1::text 
        OR a.view = $1::text`,
      [userIdOrView]
    )
    props.account = result.rows[0]
  } catch (error) {
    props.error = error as Error
  }
}

export async function addTransaction(
  client: Client,
  userid: string,
  description: string,
  amount: number,
  isInterest = false,
  ts = new Date(),
  isAllowance = false
): Promise<QueryResult> {
  return client.query(
    `INSERT INTO transactions (account, description, value, is_interest, ts, is_allowance) 
     VALUES ($1::text, $2::text, $3, $4, $5, $6)`,
    [userid, description, amount, isInterest, ts, isAllowance]
  )
}

export async function getTransactions(
  client: Client,
  props: AccountProps,
  userId: string
): Promise<void> {
  try {
    const result = await client.query(
      `SELECT id, description, extract(epoch from ts) as ts, value 
       FROM transactions 
       WHERE account = $1::text OR account IN (SELECT id FROM accounts WHERE view = $1::text)
       ORDER BY ts DESC
       LIMIT 20`,
      [userId]
    )
    props.transactions = result.rows
  } catch (error) {
    props.error = error as Error
  }
}

export default newClient

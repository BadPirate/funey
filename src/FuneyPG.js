import { Client } from "pg";

export async function newClient() {

  let client;
  if (process.env.PGHOST) {
    client = new Client({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASS,
      database: process.env.DB,
    });
  } else {
    client = new Client({
      connectionString: process.env.DOKKU_POSTGRES_AQUA_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }

  await client.connect();
  return client;
}

export async function getAccountInfo(client, props, userIdOrView) {
  return client.query(`
  SELECT 
  a.interest, a.view, a.allowance,
  (SELECT SUM(t.value) FROM transactions t WHERE t.account = a.id) as value
FROM accounts a
WHERE 
  a.id = $1::text 
  OR a.view = $1::text`,
  [userIdOrView])
  .catch((error) => {
    props.error = error
  })
  .then((result) => {
    props.account = result.rows[0]
  })
}

export async function addTransaction(client, userid, description, amount, isInterest = false, ts = new Date(), is_allowance = false) 
{
  return client.query(`
    INSERT INTO transactions (account, description, value, is_interest, ts, is_allowance) 
    VALUES ($1::text, $2::text, $3, $4, $5, $6)`, [userid, description, amount, isInterest, ts, is_allowance])
}

export async function getTransactions(client, props, userId) {
  return client.query(`
  SELECT id, description, extract(epoch from ts) as ts, value 
  FROM transactions 
  WHERE account = $1::text OR account IN (SELECT id FROM accounts WHERE view = $1::text)
  ORDER BY ts DESC
  LIMIT 20`, [userId])
  .catch((error) => {
      props.error = error
  })
  .then((result) => {
    props.transactions = result.rows || []
  })
}

export default newClient

import { Client } from "pg";
import 'dotenv/config';

export async function newClient() {
  // Load environment variables from .env.local or fall back to SQLite
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost/funey.db';
  
  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw new Error('Unable to establish database connection');
  }
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
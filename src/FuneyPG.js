import { Client } from "pg";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config';

export async function newClient() {
  const databaseUrl = process.env.DATABASE_URL || 'file:funey.db';

  if (databaseUrl.startsWith('file:')) {
    // SQLite connection
    const dbPath = databaseUrl.replace('file:', '');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Wrap SQLite connection to match pg Client interface
    return {
      query: async (text, params = []) => {
        const result = await db.all(text.replace(/\$\d+/g, '?'), params);
        return { rows: result };
      },
      end: async () => await db.close()
    };
  } else {
    // PostgreSQL connection
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
}

export async function getAccountInfo(client, props, userIdOrView) {
  return client.query(`
  SELECT 
  a.interest, a.view, a.allowance,
  (SELECT COALESCE(SUM(t.value), 0) FROM transactions t WHERE t.account = a.id) as value
FROM accounts a
WHERE 
  a.id = ? 
  OR a.view = ?`,
  [userIdOrView])
  .catch((error) => {
    props.error = error
  })
  .then((result) => {
    props.account = result.rows[0] || null
  })
}

export async function addTransaction(client, userid, description, amount, isInterest = false, ts = new Date(), is_allowance = false) 
{
  return client.query(`
    INSERT INTO transactions (account, description, value, is_interest, ts, is_allowance) 
    VALUES (?, ?, ?, ?, ?, ?)`, [userid, description, amount, isInterest, ts, is_allowance])
}

export async function getTransactions(client, props, userId) {
  return client.query(`
  SELECT id, description, strftime('%s', ts) as ts, value 
  FROM transactions 
  WHERE account = ? OR account IN (SELECT id FROM accounts WHERE view = ?)
  ORDER BY ts DESC
  LIMIT 20`, [userId, userId])
  .catch((error) => {
      props.error = error
  })
  .then((result) => {
    props.transactions = result.rows || []
  })
}

export default newClient;
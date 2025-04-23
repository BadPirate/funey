import { Client } from 'pg'
import moment from 'moment'
import { addTransaction } from './FuneyPG'

function monthDiff(d1: Date, d2: Date): number {
  let months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()
  return months <= 0 ? 0 : months
}

interface InterestResult {
  userid: string
  interest: number
  min: Date
  sum: number
  max: Date | null
}

interface AllowanceResult {
  userid: string
  allowance: number
  last: Date | null
}

const updateInterest = async (client: Client, userid: string): Promise<void> => {
  const { rows } = await client.query<InterestResult>(
    `SELECT 
      a.id as userid, a.interest, tj.min, tj.sum, ij.max
    FROM accounts a
    LEFT JOIN
    (
      SELECT account, MIN(t.ts) as min, SUM(t.value) 
      FROM transactions t
      GROUP BY account
    ) tj ON tj.account = a.id
    LEFT JOIN
    (
      SELECT account, MAX(ts) as max
      FROM transactions t
      WHERE t.is_interest = TRUE
      GROUP BY account
    ) ij on ij.account = a.id
    WHERE 
      a.id = $1::text 
      OR a.view = $1::text`,
    [userid],
  )

  const result = rows[0]
  if (!result || result.sum <= 0) return

  const next = new Date(result.max || result.min)
  next.setMonth(next.getMonth() + 1)

  if (next > new Date()) return

  await addTransaction(client, result.userid, 'Interest payment', result.sum * result.interest, true, next)
  await updateInterest(client, userid)
}

export async function updateAllowance(client: Client, userIdOrView: string): Promise<void> {
  const { rows } = await client.query<AllowanceResult>(
    `SELECT MAX(a.id) as userid,
      MAX(a.allowance) as allowance, 
      MAX(t.ts) as last
    FROM accounts as a
    LEFT JOIN transactions as t ON t.account = a.id 
      AND t.is_allowance
    WHERE a.id = $1
      OR a.view = $1`,
    [userIdOrView],
  )

  const result = rows[0]
  if (!result || result.allowance <= 0) return

  if (!result.last) {
    await addTransaction(
      client,
      result.userid,
      'First Allowance',
      result.allowance,
      false,
      moment().day() === 0 ? moment().toDate() : moment().day(-7).toDate(),
      true,
    )
    return
  }

  if (moment().diff(result.last, 'days') >= 7) {
    await addTransaction(
      client,
      result.userid,
      'Allowance',
      result.allowance,
      false,
      moment(result.last).add(7, 'days').toDate(),
      true,
    )
    await updateAllowance(client, userIdOrView)
  }
}

export default updateInterest

import moment from "moment";
import { addTransaction } from "./FuneyPG";

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

export async function updateInterest(client, userIdOrView) {
    return client.query(`
    SELECT 
  a.id as userid, a.interest, tj.min, tj.sum as sum, ij.max
FROM accounts a
LEFT JOIN
(
   SELECT account, MIN(t.ts) as min, SUM(t.value) as sum
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
  a.id = ? 
  OR a.view = ?
    `, [userIdOrView, userIdOrView])
    .catch(error => {
        console.error('Error logging interest', error)
    })
    .then(({rows}) => {
        console.log("Interest result", rows)
        const {userid, interest, min, sum, max} = rows[0]
        if (sum <= 0) return
        const next = new Date(max || min)
        next.setMonth(next.getMonth() + 1)
        if (next > new Date()) {
            console.log('Interest up to date')
            return
        }
        return addTransaction(client, userid, "Interest payment", sum * interest, true, next)
        .then(result => {
            return updateInterest(client, userIdOrView)
        })
    })
}

export async function updateAllowance(client, userIdOrView) {
  return client.query(`
SELECT MAX(a.id) as userid,
  MAX(a.allowance) as allowance, 
  MAX(t.ts) as last
FROM accounts as a
LEFT JOIN transactions as t ON t.account = a.id 
  AND t.is_allowance
WHERE a.id = $1
  OR a.view = $1
  `, [userIdOrView])
  .catch(error => {
      console.error('Error logging allowance', error)
  })
  .then(({rows}) => {
      console.log("Allowance result", rows)
      const {allowance, last, userid} = rows[0]
      if (allowance <= 0) return
      if (!last) {
        return addTransaction(client, userid, "First Allowance", allowance, false, moment().day() === 0 ? moment().toDate() : moment.day(-7).toDate(), true)
      }
      if (moment().diff(last, 'days') >= 7) {
        return addTransaction(client, userid, "Allowance", allowance, false, moment(last).add(7, 'days').toDate(), true)
        .then(() => updateAllowance(client, userIdOrView))
      }
  })
}

export default updateInterest

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
  OR a.view = $1::text
    `, [userIdOrView])
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

// export async function updateInterest(next, client, viewid, props, value, interest) {
//     if (!next) {
//         // Create a new next date
//         await client.query(`
//         UPDATE accounts SET next = to_Date('01 ' || date_part('month', (SELECT current_timestamp)) + 1 || ' ' || date_part('year', (SELECT current_timestamp)), 'dd mm YYYY')
//         WHERE view = $1
//         `, [viewid])
//             .catch(error => {
//                 props.error = JSON.stringify(error);
//             });
//     } else {
//         if (next < Date.now()) {
//             // Add interest, based on month diff, and update the next value
//             let owedMonths = monthDiff(next, new Date()) + 1;
//             while (owedMonths > 0) {
//                 props.account.value = props.account.value + (props.account.value * interest)
//                 owedMonths -= 1
//             }
//             await client.query(`
//             UPDATE accounts SET next = to_Date('01 ' || date_part('month', (SELECT current_timestamp)) + 1 || ' ' || date_part('year', (SELECT current_timestamp)), 'dd mm YYYY'),
//             value = $2
//             WHERE view = $1
//             `, [viewid, props.account.value])
//                 .catch(error => {
//                     props.error = JSON.stringify(error);
//                 });
//         }
//     }

//     return props
// }

export default updateInterest

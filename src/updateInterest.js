function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

export async function updateInterest(next, client, viewid, props, value, interest) {
    if (!next) {
        // Create a new next date
        await client.query(`
        UPDATE accounts SET next = to_Date('01 ' || date_part('month', (SELECT current_timestamp)) + 1 || ' ' || date_part('year', (SELECT current_timestamp)), 'dd mm YYYY')
        WHERE view = $1
        `, [viewid])
            .catch(error => {
                props.error = JSON.stringify(error);
            });
    } else {
        if (next < Date.now()) {
            // Add interest, based on month diff, and update the next value
            let owedMonths = monthDiff(next, new Date()) + 1;
            await client.query(`
            UPDATE accounts SET next = to_Date('01 ' || date_part('month', (SELECT current_timestamp)) + 1 || ' ' || date_part('year', (SELECT current_timestamp)), 'dd mm YYYY'),
            value = $2
            WHERE view = $1
            `, [viewid, (value + ((value * interest) * owedMonths))])
                .catch(error => {
                    props.error = JSON.stringify(error);
                });
        }
    }
}

export default updateInterest

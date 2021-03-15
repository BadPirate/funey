import { useEffect, useState } from "react"
import newClient from "../../src/newClient"
import updateInterest from "../../src/updateInterest"

const Manage = ({userid, account: {interest, value, view}}) => {
    const [hostname, setHostname] = useState();

    useEffect(() => {
        setHostname(window.location.hostname)
    },[])
    return (
        <div>
        <h1>Parent Account Management</h1>
        <h2>Current Balance:</h2>
        <form method="POST" action={`/api/manage/${userid}/update`}>
            <input name="value" defaultValue={value.toFixed(2)}></input>
            <input type="submit" value="Update Balance"/>
        <h2>Interest:</h2>
            <input name="interest" defaultValue={interest.toFixed(3)}></input>
            <input type="submit" value="Update Interest"/>
        </form>
        <h2>View: <a href={`/view/${view}`}>{`https://${hostname}/view/${view}`}</a></h2>
        </div>
    )
}

export async function getServerSideProps({query: {userid}}) {  
    const client = await newClient()
    let props = { userid }

    await client.query('SELECT * FROM accounts WHERE id = $1::text',[userid])
    .catch((error) => {
        props.error = error
    })
    .then((result) => {
        props.account = result.rows[0]
    })
    .finally(() => client.end())

    const { account : {
        next, viewid, value, interest
    }} = props

    await updateInterest(next, client, viewid, props, value, interest)

    delete props.account.next
    return { props }
  }

export default Manage
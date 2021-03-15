import { useEffect, useState } from "react"
import { Button, Card, Form, FormControl, InputGroup, Alert } from "react-bootstrap";
import newClient from "../../src/newClient"
import updateInterest from "../../src/updateInterest"

const Manage = ({userid, account: {interest, value, view}}) => {
    const [hostname, setHostname] = useState()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setHostname(window.location.hostname)
    },[])
    return (
        <Card>
            <Card.Header>
              <Card.Title>Parent Account Management</Card.Title>
            </Card.Header>
            <Card.Body>
                <h2>Account Information:</h2>
                <Card.Text>
                <Form method="POST" action={`/api/manage/${userid}/update`}>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          Balance $
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl name="value" defaultValue={value.toFixed(2)}/>
                    </InputGroup>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          Interest (Monthly on the 1st)
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl name="interest" defaultValue={interest.toFixed(3)}/>
                      <InputGroup.Append>
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                    <Button type="submit">Update</Button>
                </Form>
                </Card.Text>
                <Card.Text>
                    <h2>Kids View</h2>
                    In order for your kid to see their account balance simply bookmark this page for them:
                    <Alert className="text-center" variant="info" onClick={(e) => {
                        navigator.clipboard.writeText(`https://${hostname}/view/${view}`)
                        setCopied(true)
                        setTimeout(() => {
                            setCopied(false)
                        }, 3000)
                    }}>
                        {copied ? "Copied" : `https://${hostname}/view/${view}`}
                    </Alert>
                </Card.Text>
            </Card.Body>
        </Card>
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

    props = await updateInterest(next, client, viewid, props, value, interest)

    delete props.account.next
    return { props }
  }

export default Manage
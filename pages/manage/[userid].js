import { useEffect, useState } from "react"
import { Button, Card, Form, FormControl, InputGroup, Alert } from "react-bootstrap"
import newClient, { getAccountInfo, getTransactions } from "../../src/FuneyPG"
import TransactionsCard from "../../src/TransactionsCard"
import { updateAllowance, updateInterest } from "../../src/updateInterest"

const Manage = ({userid, transactions, account: {interest, value, view, allowance}}) => {
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
                <div className="mb-4">
                  <h2>Account Balance: ${value.toFixed(2)}</h2>
                </div>
                <div>
                  <TransactionsCard transactions={transactions}/>
                  <Form method="POST" action={`/api/manage/${userid}/transaction`}>
                    <InputGroup>
                      <FormControl name="amount" type="number" step=".01" placeholder="Amount"/>
                      <FormControl name="description" placeholder="Description"/>
                      <Button type="submit" name="action" value="subtract" variant="danger">Subtract</Button>
                      <Button type="submit" name="action" value="add" variant="success">Add</Button>
                    </InputGroup>
                  </Form>
                </div>              
              </Card.Body>
              <Card.Body>
                <Form method="POST" action={`/api/manage/${userid}/update`}>
                  <div className="mb-3">
                    <h2>Interest</h2>
                    <InputGroup>
                      <FormControl name="interest" defaultValue={interest.toFixed(3)}/> 
                    </InputGroup>
                    <Form.Text>Interest is added monthly on the 1st.</Form.Text>
                  </div>
                  <div className="mb-3">
                    <h2>Allowance</h2>
                    <InputGroup>
                      <FormControl name="allowance" defaultValue={allowance ? allowance.toFixed(3) : 0}/> 
                    </InputGroup>
                    <Form.Text>Allowance is added weekly on Sunday</Form.Text>
                  </div>
                  <div><Button type="submit">Update</Button></div>
                </Form>
              </Card.Body>
              <Card.Body>
                <div>
                    <h2>Kids View</h2>
                    <p>In order for your kid to see their account balance simply bookmark this page for them:</p>
                    <Alert className="text-center" variant="info" onClick={(e) => {
                        navigator.clipboard.writeText(`https://${hostname}/view/${view}`)
                        setCopied(true)
                        setTimeout(() => {
                            setCopied(false)
                        }, 3000)
                    }}>
                        {copied ? "Copied" : `https://${hostname}/view/${view}`}
                    </Alert>
                </div>
            </Card.Body>
        </Card>
    )
}

export async function getServerSideProps({query: {userid}}) {  
    const client = await newClient()
    let props = { userid }
    
    try {
      await getAccountInfo(client, props, userid);
      await updateInterest(client, userid);
      await updateAllowance(client, userid);
      await getTransactions(client, props, userid);
    } catch (error) {
      console.error('Error in getServerSideProps:', error);
      props.error = error.message; // Only pass the message string
    } finally {
      await client.end();
    }

    return { props }
  }

export default Manage
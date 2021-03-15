import { Card, Form, Button } from 'react-bootstrap'

export default function Home() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome to Funey!</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <b>Funey</b> is a website that makes Mo<b>ney</b> <b>Fun</b> :)
        </Card.Text>
        <Card.Text>
          To get started, create a fake "bank" account for your little ones,
          set a balance, and an interest rate (acrrued monthly) and then add the
          website link to their mobile device or iPad for "viewing" their balance.
          As they earn or spend money, come back to the manage page (bookmark or login)
          and update their account totals.
        </Card.Text>
        <h2>Login</h2>
        <Form method="POST" action="/api/login">
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="User" name="user"/>            
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="pass"/>
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
        <h2>Create Account</h2>
        <Form method="POST" action="/api/create">
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="User" name="user"/>            
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="pass"/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Repeat Password" name="pass2"/>
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
      </Card.Body>
    </Card>

  )
}

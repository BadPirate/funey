import React from 'react'
import { Form, Button } from 'react-bootstrap'

const CreateAccountForm: React.FC = () => (
  <Form method="POST" action="/api/create">
    <Form.Group className="mb-3">
      <Form.Label>Username</Form.Label>
      <Form.Control placeholder="User" name="user" />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" name="pass" />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Repeat Password</Form.Label>
      <Form.Control type="password" placeholder="Repeat Password" name="pass2" />
    </Form.Group>
    <Button type="submit" variant="success" className="w-100">
      Create Account
    </Button>
  </Form>
)

export default CreateAccountForm

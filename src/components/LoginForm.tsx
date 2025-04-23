import React from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm: React.FC = () => (
  <Form method="POST" action="/api/login">
    <Form.Group className="mb-3">
      <Form.Label>Username</Form.Label>
      <Form.Control placeholder="User" name="user" />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" name="pass" />
    </Form.Group>
    <Button type="submit" variant="primary" className="w-100">
      Login
    </Button>
  </Form>
)

export default LoginForm

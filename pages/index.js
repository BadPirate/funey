import React, { useState } from 'react'
import { Form, Button, Collapse } from 'react-bootstrap'

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  return (
    <>
      <h1 className="funey-title text-center mb-4">Welcome to Funey!</h1>
      {/* Toggle buttons and collapsible forms */}
      <div className="my-4 d-flex justify-content-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            setOpenLogin(!openLogin)
            setOpenCreate(false)
          }}
          aria-controls="login-form"
          aria-expanded={openLogin}
        >
          Login
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setOpenCreate(!openCreate)
            setOpenLogin(false)
          }}
          aria-controls="create-form"
          aria-expanded={openCreate}
        >
          Create Account
        </Button>
      </div>
      <Collapse in={openLogin}>
        <div id="login-form" className="mt-3 text-left mx-auto" style={{ maxWidth: '400px' }}>
          <Form method="POST" action="/api/login">
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control placeholder="User" name="user" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="pass" />
            </Form.Group>
            <Button type="submit" className="d-block w-100">
              Login
            </Button>
          </Form>
        </div>
      </Collapse>
      <Collapse in={openCreate}>
        <div id="create-form" className="mt-3 text-left mx-auto" style={{ maxWidth: '400px' }}>
          <Form method="POST" action="/api/create">
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control placeholder="User" name="user" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="pass" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control type="password" placeholder="Repeat Password" name="pass2" />
            </Form.Group>
            <Button type="submit" variant="success" block>
              Create Account
            </Button>
          </Form>
        </div>
      </Collapse>
      <p>
        <b>Funey</b> is a website that makes Mo<b>ney</b> <b>Fun</b> :)
      </p>
      <p>
        To get started, create a fake "bank" account for your little ones,
        set a balance, and an interest rate (accrued monthly) and then add the
        website link to their mobile device or iPad for "viewing" their balance.
        As they earn or spend money, come back to the manage page (bookmark or login)
        and update their account totals.
      </p>
    </>
  )
}
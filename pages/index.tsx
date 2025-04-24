import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Button, Collapse } from 'react-bootstrap'
import LoginForm from '../src/components/LoginForm'
import CreateAccountForm from '../src/components/CreateAccountForm'

const Home: NextPage = () => {
  const [openLogin, setOpenLogin] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  return (
    <>
      <h1 className="funey-title text-center mb-4">Welcome to Funey!</h1>
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
        <div id="login-form" className="mt-3 mx-auto" style={{ maxWidth: '400px' }}>
          <LoginForm />
        </div>
      </Collapse>
      <Collapse in={openCreate}>
        <div id="create-form" className="mt-3 mx-auto" style={{ maxWidth: '400px' }}>
          <CreateAccountForm />
        </div>
      </Collapse>
      <p>
        <b>Funey</b> is a website that makes Mo<b>ney</b> <b>Fun</b> :)
      </p>
      <p>
        To get started, create a fake &quot;bank&quot; account for your little ones, set a balance,
        and an interest rate (accrued monthly) and then add the website link to their mobile device
        or iPad for &quot;viewing&quot; their balance. As they earn or spend money, come back to the
        manage page (bookmark or login) and update their account totals.
      </p>
    </>
  )
}

export default Home

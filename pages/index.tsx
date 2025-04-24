import React, { useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { Button, Collapse, Row, Col } from 'react-bootstrap'
import LoginForm from '../src/components/LoginForm'
import CreateAccountForm from '../src/components/CreateAccountForm'
import DescriptionCard from '../src/components/DescriptionCard'
import pirateImage from '../public/assets/pirate.png'

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

      {/* Mobile view: Centered image above description */}
      <div className="d-block d-md-none text-center my-4">
        <Image src={pirateImage} alt="Funey Pirate" width={100} height={100} />
      </div>
      <div className="d-block d-md-none mt-4">
        <DescriptionCard />
      </div>

      {/* Desktop view: Centered description left, image right */}
      <Row className="d-none d-md-flex align-items-center mt-4 justify-content-center">
        <Col md={6} className="d-flex justify-content-center">
          <DescriptionCard />
        </Col>
        <Col md={4} className="text-center">
          <Image src={pirateImage} alt="Funey Pirate" width={300} height={300} />
        </Col>
      </Row>
    </>
  )
}

export default Home

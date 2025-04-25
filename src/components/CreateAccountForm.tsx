import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useRouter } from 'next/router'

const CreateAccountForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (username.length < 4) {
      setError('Username must be at least 4 characters long')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create account')
      } else {
        // Navigate to the management page
        router.push(`/manage/${data.key}`)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="User"
          name="user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={4}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="pass"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPassword2">
        <Form.Label>Repeat Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Repeat Password"
          name="pass2"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
          minLength={8}
        />
      </Form.Group>
      <Button type="submit" variant="success" className="w-100" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </Button>
    </Form>
  )
}

export default CreateAccountForm

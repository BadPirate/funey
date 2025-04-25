import React, { useState } from 'react'
import { useRouter } from 'next/router'

const CreateAccountForm: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== password2) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      router.push('/success')
    } catch (_err) {
      setError('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password2">Confirm Password</label>
        <input
          id="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  )
}

export default CreateAccountForm

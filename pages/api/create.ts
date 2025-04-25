// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'
import sha256 from 'sha256'
import accountService from '../../src/services/db/accounts'

type ApiResponse = {
  message: string
  key?: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    // Basic validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Validation failed', error: 'Username and password are required' })
    }

    // Type safe approach instead of using 'any'
    const key = sha256(`${username}&&${password}`) as string

    // Check if user exists
    const existingUser = await accountService.getUser(key)
    if (existingUser) {
      return res.status(409).json({ message: 'Account exists', error: 'Account already exists' })
    }

    // Create user
    await accountService.createUser(key, username)

    return res.status(201).json({
      message: 'Account created successfully!',
      key,
    })
  } catch (error) {
    console.error('Create account error:', error)
    return res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Failed to create account',
    })
  }
}

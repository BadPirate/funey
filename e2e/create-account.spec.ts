import { test, expect } from '@playwright/test'
import sha256 from 'sha256'

test('create account should navigate to manage page on success', async ({ page, baseURL }) => {
  console.log('Starting test with baseURL:', baseURL)

  // Define retry options for resilient navigation
  const maxRetries = 3
  let retries = 0
  let success = false

  while (retries < maxRetries && !success) {
    try {
      // Navigate to the homepage with a load state wait
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 })
      console.log('Page URL after navigation:', page.url())

      // Wait for the H1 to appear with text - this is a critical element
      await page.waitForSelector('h1:has-text("Welcome to Funey")', {
        state: 'visible',
        timeout: 10000,
      })

      success = true
    } catch (error) {
      retries++
      // Type-safe error handling
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.log(`Attempt ${retries}/${maxRetries} failed:`, errorMessage)

      if (retries < maxRetries) {
        console.log(`Retrying in 2 seconds...`)
        await page.waitForTimeout(2000)
      } else {
        throw new Error(`Failed to load homepage after ${maxRetries} attempts: ${errorMessage}`)
      }
    }
  }

  // Find and wait for the Create Account toggle button to be ready
  await page.waitForSelector('button[aria-controls="create-form"]', {
    state: 'visible',
    timeout: 5000,
  })

  // Click the button to open the create account form
  await page.click('button[aria-controls="create-form"]')

  // Wait for the form to appear and be fully rendered after animation
  await page.waitForSelector('div#create-form form', {
    state: 'visible',
    timeout: 5000,
  })

  // Generate a random username to avoid conflicts
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  const username = `testuser${randomSuffix}`
  const password = 'securePass123'

  console.log(`Using random test credentials: username=${username}`)

  // Wait for all form fields to be present before interacting with them
  await page.waitForSelector('div#create-form input[name="user"]', { state: 'visible' })
  await page.waitForSelector('div#create-form input[name="pass"]', { state: 'visible' })
  await page.waitForSelector('div#create-form input[name="pass2"]', { state: 'visible' })

  // Fill in credentials (with verification of successful input)
  await page.fill('div#create-form input[name="user"]', username)
  await page.fill('div#create-form input[name="pass"]', password)
  await page.fill('div#create-form input[name="pass2"]', password)

  // Verify inputs were properly filled before proceeding
  await expect(page.locator('div#create-form input[name="user"]')).toHaveValue(username)
  await expect(page.locator('div#create-form input[name="pass"]')).toHaveValue(password)
  await expect(page.locator('div#create-form input[name="pass2"]')).toHaveValue(password)

  // Add request/response intercept
  page.on('request', (request) => {
    if (request.url().includes('/api/create')) {
      console.log('Request to /api/create:', {
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
      })
    }
  })

  page.on('response', async (response) => {
    if (response.url().includes('/api/create')) {
      const status = response.status()
      console.log(`Response from /api/create: status=${status}`)

      try {
        const body = await response.text()
        console.log('Response body:', body)

        if (status === 201) {
          try {
            const data = JSON.parse(body)
            console.log('Parsed JSON response:', data)
          } catch (_e) {
            console.log('Failed to parse JSON response')
          }
        }
      } catch (_e) {
        console.log('Error getting response body')
      }
    }
  })

  // Make sure submit button is visible and enabled before proceeding
  const submitButton = await page.waitForSelector('div#create-form button[type="submit"]', {
    state: 'visible',
    timeout: 5000,
  })

  // Ensure button is enabled
  const isDisabled = await submitButton.getAttribute('disabled')
  if (isDisabled) {
    console.log('Warning: Submit button is disabled, waiting briefly for it to become enabled')
    await page.waitForTimeout(1000) // Give UI state time to update if needed
  }

  // Submit form and wait for API response
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/create') && r.status() === 201,
    { timeout: 10000 },
  )

  await page.click('div#create-form button[type="submit"]')
  const response = await responsePromise

  // Parse the response data and verify
  const data = await response.json()
  expect(data).toHaveProperty('key')
  expect(data).toHaveProperty('message', 'Account created successfully!')

  // Compute expected key and verify navigation
  const expectedKey = sha256(`${username}&&${password}`)
  expect(data.key).toBe(expectedKey)

  // Wait for client-side navigation to complete
  await page.waitForURL(`${baseURL}/manage/${expectedKey}`, { timeout: 10000 })
  expect(page.url()).toBe(`${baseURL}/manage/${expectedKey}`)
})

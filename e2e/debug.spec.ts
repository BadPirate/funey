import { test, expect } from '@playwright/test'

test('can load the homepage successfully', async ({ page, baseURL }) => {
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

      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/homepage-debug.png' })

      // Log page title
      const title = await page.title()
      console.log(`Page title: "${title}"`)

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

  // Log page HTML for debug
  const html = await page.content()
  console.log('Page HTML preview:', html.substring(0, 200) + '...')

  // Find all buttons on the page
  const buttons = await page.$$('button')
  console.log(`Found ${buttons.length} buttons on the page`)

  // Verify we have at least one button
  expect(buttons.length).toBeGreaterThan(0)

  for (const button of buttons) {
    const text = await button.textContent()
    const ariaControls = await button.getAttribute('aria-controls')
    console.log(`Button text: "${text?.trim()}" aria-controls="${ariaControls || 'none'}"`)
  }

  // Look for key homepage elements
  const h1 = await page.$('h1')
  if (h1) {
    const h1Text = await h1.textContent()
    console.log('H1 text:', h1Text)
    expect(h1Text).toContain('Welcome to Funey')
  } else {
    console.log('No H1 element found')
    throw new Error('H1 element not found on page')
  }

  // Look specifically for the Create Account button
  const createAccountBtn = await page.waitForSelector('button:has-text("Create Account")', {
    state: 'visible',
    timeout: 5000,
  })
  expect(createAccountBtn).not.toBeNull()

  console.log('Test completed successfully')
})

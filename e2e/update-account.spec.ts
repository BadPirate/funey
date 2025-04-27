import { test, expect } from '@playwright/test'
import sha256 from 'sha256'

test('can update interest and allowance and get redirected', async ({ page, baseURL }) => {
  // Create a new user
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForSelector('button[aria-controls="create-form"]', { state: 'visible' })
  await page.click('button[aria-controls="create-form"]')
  await page.waitForSelector('div#create-form form', { state: 'visible' })

  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  const username = `updateuser${randomSuffix}`
  const password = 'updatePass123'

  await page.fill('div#create-form input[name="user"]', username)
  await page.fill('div#create-form input[name="pass"]', password)
  await page.fill('div#create-form input[name="pass2"]', password)

  const submitButtonLocator = page.locator('div#create-form button[type="submit"]')
  await expect(submitButtonLocator).toBeEnabled()
  await submitButtonLocator.click()
  await page.waitForResponse((r) => r.url().includes('/api/create') && r.status() === 201)

  const expectedKey = sha256(`${username}&&${password}`)
  await page.waitForURL(`${baseURL}/manage/${expectedKey}`, { timeout: 10000 })
  expect(page.url()).toBe(`${baseURL}/manage/${expectedKey}`)

  // Update interest and allowance
  await page.waitForSelector('form[action^="/api/manage/"][method="POST"]', { state: 'visible' })
  await page.fill('input[name="interest"]', '0.123')
  await page.fill('input[name="allowance"]', '9.87')
  await page.click('form[action^="/api/manage/"][method="POST"] button[type="submit"]')

  // Assert we are redirected back to the manage page (not a JSON dump)
  await page.waitForURL(`${baseURL}/manage/${expectedKey}`)
  // The UI should still be visible (not a JSON response)
  await expect(page.getByRole('heading', { name: /Account Balance/i })).toBeVisible()
  // Check that the new interest and allowance values are displayed
  await expect(page.locator('input[name="interest"]')).toHaveValue('0.123')
  await expect(page.locator('input[name="allowance"]')).toHaveValue('9.870')
})

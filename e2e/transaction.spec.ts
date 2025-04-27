import { test, expect } from '@playwright/test'
import sha256 from 'sha256'

test('can create a transaction and see it in the UI', async ({ page, baseURL }) => {
  // Create a new user (reuse logic from create-account.spec.ts)
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForSelector('button[aria-controls="create-form"]', { state: 'visible' })
  await page.click('button[aria-controls="create-form"]')
  await page.waitForSelector('div#create-form form', { state: 'visible' })

  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  const username = `txnuser${randomSuffix}`
  const password = 'txnPass123'

  await page.fill('div#create-form input[name="user"]', username)
  await page.fill('div#create-form input[name="pass"]', password)
  await page.fill('div#create-form input[name="pass2"]', password)

  // Wait for submit button to be enabled before clicking
  const submitButtonLocator = page.locator('div#create-form button[type="submit"]')
  await expect(submitButtonLocator).toBeEnabled()
  await submitButtonLocator.click()
  await page.waitForResponse((r) => r.url().includes('/api/create') && r.status() === 201)

  const expectedKey = sha256(`${username}&&${password}`)
  await page.waitForURL(`${baseURL}/manage/${expectedKey}`, { timeout: 10000 })
  expect(page.url()).toBe(`${baseURL}/manage/${expectedKey}`)

  // Add a transaction
  await page.waitForSelector('form[action^="/api/manage/"]', { state: 'visible' })
  await page.fill('form[action^="/api/manage/"] input[name="description"]', 'Test Transaction')
  await page.fill('form[action^="/api/manage/"] input[name="amount"]', '42')
  await page.click('form[action^="/api/manage/"] button[type="submit"]')

  // Assert we are redirected back to the manage page (not a JSON dump)
  await page.waitForURL(`${baseURL}/manage/${expectedKey}`)
  // The UI should still be visible (not a JSON response)
  await expect(page.getByRole('heading', { name: /Account Balance/i })).toBeVisible()
  // Wait for transaction to appear in the UI
  const txnRow = await page.locator('text=Test Transaction').first()
  expect(await txnRow.isVisible()).toBeTruthy()
  const valueCell = await txnRow.locator('..').locator('text=42')
  expect(await valueCell.isVisible()).toBeTruthy()
})

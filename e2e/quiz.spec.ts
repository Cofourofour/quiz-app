import { test, expect } from '@playwright/test'

test('quiz flow works end to end', async ({ page }) => {
  // Go to landing page
  await page.goto('/')
  
  // Check landing page loads
  await expect(page.locator('h2')).toContainText('What Type of Digital Nomad Are You?')
  
  // Click "Take the Quiz" button
  await page.click('text=Take the Quiz')
  
  // Should be on quiz page
  await expect(page).toHaveURL(/\/quiz\/digital-nomad-type/)
  
  // Fill out email
  await page.fill('input[type="email"]', 'test@example.com')
  
  // Answer all questions (selecting option A for all)
  const questions = await page.locator('input[type="radio"]').count()
  
  // Select first option for each question
  for (let i = 0; i < questions; i += 4) {
    await page.locator('input[type="radio"]').nth(i).click()
  }
  
  // Accept terms
  await page.check('input[type="checkbox"]')
  
  // Submit quiz
  await page.click('button[type="submit"]')
  
  // Check for result display (wait a bit for API call)
  await page.waitForSelector('text=Check Your Email!', { timeout: 10000 })
  
  // Check that result is displayed
  await expect(page.locator('h2')).toBeVisible()
})

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check main heading
  await expect(page.locator('h2')).toContainText('What Type of Digital Nomad Are You?')
  
  // Check CTA button exists
  await expect(page.locator('text=Take the Quiz')).toBeVisible()
  
  // Check features section
  await expect(page.locator('text=6 Quick Questions')).toBeVisible()
  await expect(page.locator('text=Personalized Results')).toBeVisible()
  await expect(page.locator('text=4 Unique Types')).toBeVisible()
})

test('quiz form validation works', async ({ page }) => {
  await page.goto('/quiz/digital-nomad-type')
  
  // Try to submit without filling anything
  const submitButton = page.locator('button[type="submit"]')
  await expect(submitButton).toBeDisabled()
  
  // Fill email
  await page.fill('input[type="email"]', 'test@example.com')
  await expect(submitButton).toBeDisabled()
  
  // Answer one question
  await page.locator('input[type="radio"]').first().click()
  await expect(submitButton).toBeDisabled()
  
  // Check consent
  await page.check('input[type="checkbox"]')
  await expect(submitButton).toBeDisabled() // Still disabled because not all questions answered
})

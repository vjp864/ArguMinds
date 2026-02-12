import { test, expect } from "@playwright/test"

// Helper to log in before each test
async function login(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  await page.goto("/login")
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 })
}

// These tests require a test user to exist in the database.
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars, or skip.
const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? ""
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? ""

const shouldRun = TEST_EMAIL && TEST_PASSWORD

test.describe("Dashboard", () => {
  test.skip(!shouldRun, "TEST_USER_EMAIL and TEST_USER_PASSWORD not set")

  test.beforeEach(async ({ page }) => {
    await login(page, TEST_EMAIL, TEST_PASSWORD)
  })

  test("dashboard loads and shows header", async ({ page }) => {
    await expect(page.locator("text=Mes Dossiers")).toBeVisible()
    await expect(page.locator("text=ARGUMINDS").first()).toBeVisible()
  })

  test("can open new case dialog", async ({ page }) => {
    await page.click("text=Nouveau dossier")
    await expect(page.locator("text=Créer un dossier")).toBeVisible()
    await expect(page.locator('input[name="title"]')).toBeVisible()
  })

  test("can create and delete a case", async ({ page }) => {
    const title = `Test E2E ${Date.now()}`

    // Create
    await page.click("text=Nouveau dossier")
    await page.fill('input[name="title"]', title)
    await page.click('button:has-text("Créer")')

    // Wait for case to appear
    await expect(page.locator(`text=${title}`)).toBeVisible({ timeout: 10000 })

    // Navigate to case
    await page.click(`text=${title}`)
    await page.waitForURL(/\/dashboard\//)

    // Verify case detail page
    await expect(page.locator("h1").filter({ hasText: title })).toBeVisible()

    // Delete via CaseActions menu
    await page.click('[data-testid="case-actions"]')
    await page.click("text=Supprimer")
    await page.click('button:has-text("Supprimer")')

    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard$/, { timeout: 10000 })
  })

  test("case detail page shows graph and sources sections", async ({ page }) => {
    const title = `Graph Test ${Date.now()}`

    // Create a case
    await page.click("text=Nouveau dossier")
    await page.fill('input[name="title"]', title)
    await page.click('button:has-text("Créer")')
    await expect(page.locator(`text=${title}`)).toBeVisible({ timeout: 10000 })

    // Navigate to it
    await page.click(`text=${title}`)
    await page.waitForURL(/\/dashboard\//)

    // Check that key sections are present
    await expect(page.locator("text=Ajouter un argument")).toBeVisible()
    await expect(page.locator("text=0 argument")).toBeVisible()

    // Check export buttons
    await expect(page.locator("button >> text=PDF")).toBeVisible()
    await expect(page.locator("button >> text=Word")).toBeVisible()

    // Cleanup — go back and delete
    await page.goBack()
    await page.waitForURL(/\/dashboard$/)
  })
})

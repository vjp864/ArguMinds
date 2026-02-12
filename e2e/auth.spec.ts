import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("landing page shows login and register buttons", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("text=ARGUMINDS").first()).toBeVisible()
    await expect(page.locator("text=Se connecter").first()).toBeVisible()
    await expect(page.locator("text=Créer un compte").first()).toBeVisible()
  })

  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("text=ARGUMINDS").first()).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test("register page renders correctly", async ({ page }) => {
    await page.goto("/register")
    await expect(page.locator("text=ARGUMINDS").first()).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "invalid@example.com")
    await page.fill('input[name="password"]', "wrongpassword")
    await page.click('button[type="submit"]')
    await expect(page.locator("text=Email ou mot de passe incorrect")).toBeVisible({
      timeout: 10000,
    })
  })

  test("unauthenticated user is redirected from dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain("/login")
  })

  test("register with missing fields shows validation error", async ({ page }) => {
    await page.goto("/register")
    await page.click('button[type="submit"]')
    // Form should not navigate away — still on register page
    await expect(page).toHaveURL(/\/register/)
  })
})

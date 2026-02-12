import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test("displays hero section", async ({ page }) => {
    await page.goto("/")
    await expect(
      page.locator("text=Structurez vos arguments"),
    ).toBeVisible()
    await expect(
      page.locator("text=avec clarté"),
    ).toBeVisible()
    await expect(
      page.locator("text=Commencer gratuitement"),
    ).toBeVisible()
  })

  test("displays features section", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("text=Graphe visuel")).toBeVisible()
    await expect(page.locator("text=Sources centralisées")).toBeVisible()
    await expect(page.locator("text=Export professionnel")).toBeVisible()
  })

  test("displays how it works section", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("text=Comment ça marche")).toBeVisible()
    await expect(page.locator("text=Créez un dossier")).toBeVisible()
    await expect(page.locator("text=Argumentez")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Exportez" })).toBeVisible()
  })

  test("CTA links navigate correctly", async ({ page }) => {
    await page.goto("/")

    // Click "Commencer gratuitement" → should go to /register
    await page.locator("text=Commencer gratuitement").first().click()
    await page.waitForURL(/\/register/)
    expect(page.url()).toContain("/register")
  })

  test("navbar login link works", async ({ page }) => {
    await page.goto("/")
    // Click navbar "Se connecter"
    await page.locator("header >> text=Se connecter").click()
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain("/login")
  })

  test("displays footer", async ({ page }) => {
    await page.goto("/")
    await expect(
      page.locator("footer >> text=Plateforme d'Intelligence Argumentative"),
    ).toBeVisible()
  })
})

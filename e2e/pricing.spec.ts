import { expect, test } from "@playwright/test"

const prices = ["$0", "$399", "$549", "$799", "$999"]
const names = ["Free", "Starter", "Lab", "Group", "Team"]

test("pricing lists the five yearly prices and start on free opens sign in", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("banner").getByRole("link", { name: "Pricing" }).click()
    await expect(page).toHaveURL(/\/pricing$/)

    for (const name of names) {
        await expect(page.getByRole("heading", { name, exact: true })).toBeVisible()
    }
    for (const price of prices) {
        await expect(page.getByText(price, { exact: true })).toBeVisible()
    }

    await page.getByRole("link", { name: "Start on Free" }).click()
    await expect(page).toHaveURL(/\/signin$/)

    await page.goto("/pricing")
    const hrefs = await page.locator("footer a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.every((href) => href !== null && href !== "#" && href !== "")).toBe(true)
})

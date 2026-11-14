import { expect, test } from "@playwright/test"
import { createLaboratory, expiredAccessToken, signIn, testEmail } from "./session"

test("a magic link creates a free laboratory and a second invite is refused", async ({ page }) => {
    const email = testEmail("owner")
    await signIn(page, email)
    const slug = await createLaboratory(page, "E2E Free Lab")

    await expect(page.getByText("1/1")).toBeVisible()
    await expect(page.getByText("Free").first()).toBeVisible()

    await page.getByRole("link", { name: "Team" }).click()
    await page.getByRole("button", { name: "Add Member" }).click()
    const dialog = page.getByRole("dialog", { name: "Add New Team Member" })
    await dialog.getByRole("combobox").click()
    await page.getByRole("option", { name: "MEMBER" }).click()
    await dialog.getByLabel("Full name *").fill("Second Member")
    await dialog.getByLabel("Email *").fill(testEmail("second"))
    await dialog.getByRole("button", { name: "Add Member" }).click()
    await expect(page.getByText("This plan allows 1 user.")).toBeVisible()
    await expect(page.getByText("Second Member")).toHaveCount(0)
    await page.getByRole("button", { name: "Cancel" }).click()

    await page.getByRole("button", { name: "Log out" }).click()
    await page.waitForURL("**/signin")
    await page.goto(`/${slug}/animals`)
    await expect(page).toHaveURL(/\/signin/)
})

test("an expired access cookie sends the laboratory page to sign in", async ({ page }) => {
    await page.context().addCookies([{
        name: "auth-token",
        value: expiredAccessToken(),
        url: "http://127.0.0.1:3100",
    }])
    await page.goto("/colony/dashboard")
    await expect(page).toHaveURL(/\/signin/)
})

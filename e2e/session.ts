import { execFile } from "node:child_process"
import { createSign, randomUUID } from "node:crypto"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { expect, type Page } from "@playwright/test"

const execFileAsync = promisify(execFile)

const inboxDir = path.resolve(__dirname, ".inbox")

export function inboxPath() {
    return inboxDir
}

export function testEmail(label: string) {
    return `${label}-${randomUUID()}@labassist.test`
}

export function expiredAccessToken() {
    const key = process.env.E2E_PRIVATE_KEY
    if (!key) throw new Error("E2E signing key is missing")
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url")
    const body = Buffer.from(JSON.stringify({
        userId: "11111111-1111-4111-8111-111111111111",
        exp: Math.floor(Date.now() / 1000) - 60,
    })).toString("base64url")
    const unsigned = `${header}.${body}`
    const signer = createSign("RSA-SHA256")
    signer.update(unsigned)
    return `${unsigned}.${signer.sign(key).toString("base64url")}`
}

async function latestLink(email: string) {
    const file = path.join(inboxDir, "messages.jsonl")
    let found = ""
    await expect.poll(async () => {
        const text = await readFile(file, "utf8").catch(() => "")
        const rows = text.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as { to: string; url: string })
        found = rows.filter((row) => row.to === email).at(-1)?.url ?? ""
        return found
    }, { timeout: 20_000 }).not.toBe("")
    return found
}

export async function signIn(page: Page, email: string) {
    await page.goto("/signin")
    await page.getByLabel("Email address").fill(email)
    await page.getByRole("button", { name: "Email me a link" }).click()
    await expect(page.getByText("If the address can receive mail, a sign-in link is on its way.")).toBeVisible()
    const url = await latestLink(email)
    await page.goto(url)
    await page.waitForURL("**/account")
}

export async function createLaboratory(page: Page, name: string) {
    const profile = page.getByRole("dialog", { name: "Your profile" })
    await profile.waitFor({ state: "visible" })
    await profile.getByLabel("First name *").fill("Owner")
    await profile.getByRole("button", { name: "Save profile" }).click()
    await expect(profile).toBeHidden()
    const stamp = randomUUID().slice(0, 8)
    await page.getByRole("button", { name: "Create New Lab" }).first().click()
    await page.waitForURL("**/laboratory-setup")
    await page.getByLabel(/Username/).fill(`owner${stamp}`)
    await page.getByLabel(/Position/).fill("PI")
    await page.getByLabel(/Laboratory Name/).fill(name)
    await page.getByRole("button", { name: "Create Laboratory" }).click()
    await page.waitForURL("**/account**")
    await page.goto("/account?fresh=1")
    await page.getByText(name, { exact: true }).first().click()
    await page.waitForURL(/\/[^/]+\/dashboard$/)
    return new URL(page.url()).pathname.split("/")[1]
}

export async function setPlan(slug: string, planName: string) {
    await execFileAsync("npx", ["tsx", "scripts/e2e-set-plan.ts", slug, planName], {
        cwd: path.resolve(__dirname, "../../be-lab"),
        env: process.env,
    })
}

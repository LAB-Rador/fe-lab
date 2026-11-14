import { generateKeyPairSync } from "node:crypto"
import { defineConfig, devices } from "@playwright/test"
import { inboxPath } from "./e2e/session"

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 })
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString()
const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString()
const databaseUrl = "postgresql://egorkolev@127.0.0.1:54329/labassist_test?schema=public"
const inbox = inboxPath()
const origin = "http://127.0.0.1:3100"
const apiOrigin = "http://127.0.0.1:8090"

process.env.E2E_PRIVATE_KEY = privatePem
process.env.DATABASE_URL = databaseUrl
process.env.DIRECT_URL = databaseUrl
process.env.E2E_INBOX_DIR = inbox

const serverEnv = {
    ...Object.fromEntries(Object.entries(process.env).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
    DATABASE_URL: databaseUrl,
    DIRECT_URL: databaseUrl,
    PUBLIC_KEY: publicPem,
    PRIVATE_KEY: privatePem,
    E2E_INBOX_DIR: inbox,
    FRONTEND_URL: origin,
    PORT: "8090",
    NEXT_PUBLIC_LOCAL_DATABASE_URL: apiOrigin,
    NEXT_PUBLIC_DATABASE_URL: apiOrigin,
    E2E_DIST: "1",
}

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.spec.ts",
    fullyParallel: false,
    workers: 1,
    timeout: 120_000,
    expect: { timeout: 20_000 },
    globalSetup: "./e2e/global-setup.ts",
    globalTeardown: "./e2e/global-teardown.ts",
    use: {
        baseURL: origin,
        viewport: { width: 1280, height: 800 },
        trace: "retain-on-failure",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    ],
    webServer: [
        {
            command: "node e2e/start-api.mjs",
            url: `${apiOrigin}/health`,
            timeout: 120_000,
            reuseExistingServer: false,
            env: serverEnv,
        },
        {
            command: "npx next dev -p 3100",
            url: origin,
            timeout: 180_000,
            reuseExistingServer: false,
            env: serverEnv,
        },
    ],
})

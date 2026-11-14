import { execFileSync, spawn } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const url = process.env.DATABASE_URL ?? ""
if (!url.includes(":54329/labassist_test")) {
    console.error("Refusing to start the API against a database that is not the local test Postgres")
    process.exit(1)
}
if (!process.env.E2E_INBOX_DIR || !process.env.PUBLIC_KEY || !process.env.PRIVATE_KEY) {
    console.error("The e2e API is missing its inbox directory or signing keys")
    process.exit(1)
}

const beLab = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../be-lab")
const dataDir = path.join(beLab, ".test-pg")
if (!existsSync(path.join(dataDir, "PG_VERSION"))) {
    execFileSync("initdb", ["-D", dataDir, "--auth=trust", "--no-locale"], { stdio: "inherit" })
}
try {
    execFileSync("pg_ctl", ["-D", dataDir, "status"], { stdio: "ignore" })
} catch {
    execFileSync("pg_ctl", ["-D", dataDir, "-o", "-p 54329 -k /tmp", "-l", path.join(dataDir, "server.log"), "start"], { stdio: "inherit" })
}
execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
    cwd: beLab,
    stdio: "inherit",
    env: process.env,
})

const child = spawn("node", ["--import", "tsx/esm", "src/index.ts"], {
    cwd: beLab,
    stdio: "inherit",
    env: process.env,
})

child.on("exit", (code) => process.exit(code ?? 1))

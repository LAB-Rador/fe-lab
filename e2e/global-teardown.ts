import { execFileSync } from "node:child_process"
import path from "node:path"

export default function globalTeardown() {
    const dataDir = path.resolve(__dirname, "../../be-lab/.test-pg")
    try {
        execFileSync("pg_ctl", ["-D", dataDir, "stop"], { stdio: "inherit" })
    } catch {
        // The cluster was already stopped.
    }
}

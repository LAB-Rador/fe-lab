import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"

const beLab = path.resolve(__dirname, "../../be-lab")
const dataDir = path.join(beLab, ".test-pg")
const databaseUrl = "postgresql://egorkolev@127.0.0.1:54329/labassist_test?schema=public"

function run(command: string, args: string[], cwd = beLab) {
    execFileSync(command, args, { cwd, stdio: "inherit" })
}

export default function globalSetup() {
    if (!existsSync(path.join(dataDir, "PG_VERSION"))) {
        run("initdb", ["-D", dataDir, "--auth=trust", "--no-locale"], process.cwd())
    }
    try {
        run("pg_ctl", ["-D", dataDir, "status"], process.cwd())
    } catch {
        run("pg_ctl", ["-D", dataDir, "-o", "-p 54329 -k /tmp", "-l", path.join(dataDir, "server.log"), "start"], process.cwd())
    }
    try {
        run("createdb", ["-h", "127.0.0.1", "-p", "54329", "labassist_test"], process.cwd())
    } catch {
        // The test database is already there.
    }
    execFileSync("npx", ["prisma", "db", "push", "--skip-generate"], {
        cwd: beLab,
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: databaseUrl },
    })
    execFileSync("psql", ["-h", "127.0.0.1", "-p", "54329", "-d", "labassist_test", "-v", "ON_ERROR_STOP=1", "-c", `
        DO $$ DECLARE
            table_row RECORD;
        BEGIN
            FOR table_row IN
                SELECT tablename FROM pg_tables WHERE schemaname = 'public'
            LOOP
                EXECUTE 'TRUNCATE TABLE ' || quote_ident(table_row.tablename) || ' RESTART IDENTITY CASCADE';
            END LOOP;
        END $$;
    `], { stdio: "inherit" })
}

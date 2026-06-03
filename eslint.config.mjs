import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([globalIgnores([
    "**/node_modules",
    "**/.next",
    "**/dist",
    "**/build",
    "**/coverage",
    "**/*.config.js",
    "**/*.config.mjs",
    "**/*.css",
]), {
    extends: [...nextCoreWebVitals],

    rules: {
        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],
    },
}]);
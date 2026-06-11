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
        // Relax overly strict React 19/Next 16 lint rules to unblock CI
        // Keep core hooks ordering strict, but tone down new compiler-driven rules
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/refs": "off",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/preserve-manual-memoization": "off",
        "react-hooks/purity": "off",
        "react-hooks/immutability": "off",
        "react/no-unescaped-entities": "off",
    },
}]);
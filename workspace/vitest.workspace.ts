import { defineWorkspace } from "vitest/config";

// REF: https://vitest.dev/guide/workspace.html
export default defineWorkspace([
    "node/*",
    "packages/*",
]);

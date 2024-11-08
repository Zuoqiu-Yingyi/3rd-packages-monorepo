import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

// REF: https://vitest.dev/config/
export default defineProject({
    plugins: [
        // REF: https://www.npmjs.com/package/vite-tsconfig-paths
        // @ts-expect-error tsconfigPaths' type version is not compatible
        tsconfigPaths(),
    ],
    test: {
        dir: "tests",
    },
});

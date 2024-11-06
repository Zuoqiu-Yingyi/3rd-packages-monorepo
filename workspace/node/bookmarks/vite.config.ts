/// <reference types="vitest" />

import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: `./`,
    plugins: [
        // REF: https://www.npmjs.com/package/vite-tsconfig-paths
        tsconfigPaths(),
        // REF https://github.com/qmhc/vite-plugin-dts/blob/HEAD/README.zh-CN.md
        dts({
            insertTypesEntry: true,
            include: [
                "./src",
            ],
        }),
    ],
    build: {
        outDir: "./dist",
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "bookmarks",
            fileName: "index",
            formats: [
                "es",
                "umd",
                // "cjs",
                "iife",
            ],
        },
    },
});

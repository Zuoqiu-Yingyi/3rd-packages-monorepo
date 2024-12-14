/**
 * @type {import("lint-staged").Config}
 * @see {@link https://www.npmjs.com/package/lint-staged | lint-staged}
 */
const config = {
    // REF: https://github.com/sudo-suhas/lint-staged-django-react-demo
    "*": "cspell lint --no-must-find-files",
    "*.{js,ts}": "eslint --fix",
    "*.{css,scss,less,pcss,postcss}": "eslint --fix",
    "*.{jsx,tsx,vue,svelte}": "eslint --fix",
    "*.{md}": "eslint --fix",
    "*.{xml,json,jsonc,json5,yml,yaml,toml}": "eslint --fix",
    "*.{svg,xbel}": "eslint --fix",
};

export default config;

import { build } from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const virtualShimPlugin = {
    name: 'virtual-shim',
    setup(build) {
        build.onResolve({ filter: /^node:worker_threads$|^worker_threads$/ }, () => {
            return { path: 'worker_threads', namespace: 'virtual' };
        });

        build.onLoad({ filter: /.*/, namespace: 'virtual' }, () => {
            return {
                contents: 'export default {};',
                loader: 'js',
            };
        });
    },
};

await build({
    entryPoints: ["src/plugin.ts"],
    bundle: true,
    platform: "neutral",
    format: "iife",
    globalName: "plugin",
    minify: true,
    keepNames: true,
    mainFields: ["module", "main"],
    outfile: "dist/plugin.js",
    external: ["node:*"],
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
        "global": "globalThis",
        "navigator": "({ userAgent: 'Mozilla/5.0' })",
    },
    drop: ["console"],
    plugins: [
        virtualShimPlugin,
        polyfillNode({
            polyfills: {
                stream: true,
                buffer: true,
                process: true,
            },
        })
    ],
});
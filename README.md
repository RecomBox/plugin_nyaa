## Introduction
This is a template that help you build a plugin for [recombox_plugin_provider](https://github.com/RecomBox/recombox_plugin_provider).

We use [boa_engine](https://docs.rs/boa_engine/latest/boa_engine/) to load plugin that compiled to javascript using this template `[Rust <-bridge-> Javascript]` .

So be prepared to build in a very sandbox and strict environment.

Note: Most additional methods and types are available in
```typescript
// Global Types
import "@plugin_provider/global/types/..."

// Network, File IO, ...etc
import "@plugin_provider/method/..."
```
When testing and build. Most of the methods used different internal injected functions (It's handled. So don't worry about it.).


Example: 
- During Test: `fetch` is use for networking.
- During Build: `reqwest` is injected from rust side.



## Installation
Make sure you have the following installed:
- [NodeJS](https://nodejs.org/)
- [Bun](https://bun.com/) or [NPM](https://www.npmjs.com/) or whatever runtime you want to use


## Making Plugins
Clone or Fork this repository
```bash
git clone https://github.com/RecomBox/recombox_plugin_provider
cd recombox_plugin_provider
```

Go to `plugin_template` directory
```bash
cd plugins/plugin_template
```
- You can copy the template and rename the directory to your pluign name.
- Make sure to add your plugin to another repository and add it to `/plugins_manifest.json`

Install dependencies:
```bash
# Or use any runtime you want
bun install
```

**[Required]** export functions inside `plugin.ts`:
```typescript
import type * as get_sources_types from "@plugin_provider/global/types/get_sources";
import type * as get_torrents_types from "@plugin_provider/global/types/get_torrents";

export function get_sources(input_payload: get_sources_types.InputPayload): get_sources_types.OutputPayload {...}
export function get_torrents(input_payload: get_torrents_types.InputPayload): get_torrents_types.OutputPayload {...}

```
- All additional types and methods available in `import "@plugin_provider/..."` and global declared functions.
- You can create ts files, functions, install and import packages as much as you want.
- But there some unsupported packages: 
    - Network (Some methods available in global declared functions)
    - File IO (Some methods available in global declared functions)
    - And any other packages that can't be load in `boa_engine`

Build Plugin:
```bash
bun run build
```
- Output to `dist/plugin.js`
- Enable auto release by rename `.github/workflows/build-release.yml.disable` to `.github/workflows/build-release.yml`


Test Plugin;
- Write and modify test inside `test.ts`
```bash
# Or use any runtime you want
bun run test
```







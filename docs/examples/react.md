---
title: React | Examples
---

# React

The `React` example project can be found on `examples/react-router` package/directory.

The router used on this example project is [react-router](https://reactrouter.com/) <outbound-link />.

The `React` example has been created using `create-vite` template with `PNPM`:
```shell
pnpx create-vite
+ create-vite 2.5.4
√ Project name: ... react-router
√ Select a framework: » react
√ Select a variant: » react-ts

Scaffolding project in examples\react-router...

Done. Now run:

  cd react-router
  npm install
  npm run dev
```

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:
<HeuristicWorkboxWindow />

## generateSW

`generateSW` has the following behaviors:
- `Prompt for update`:
  - Show `Ready to work offlline` on first visit and once the `service worker` ready.
  - Show `Prompt for update` when new `service worker` available.

- `Auto update`:
  - Show `Ready to work offlline` on first visit and once the `service worker` ready.
  - When new content available, the service worker will be updated automatically.

- `Prompt for update` with `Periodic service worker updates`:
  - Show `Ready to work offlline` on first visit and once the `service worker` ready.
  - Show `Prompt for update` when new `service worker` available.
  - The example project will register a `Periodic service worker updates`

- `Auto update` with `Periodic service worker updates`:
  - Show `Ready to work offlline` on first visit and once the `service worker` ready.
  - The example project will register a `Periodic service worker updates`
  - When new content available, the service worker will be updated automatically.

To run each behavior, execute one of the following scripts from your shell (from root folder):
- `Prompt for update`:
```shell
pnpm run example:react:router:start
```

- `Auto update`:
```shell
pnpm run example:react:router:start:claims
```

- `Prompt for update` with `Periodic service worker updates`:
```shell
pnpm run example:react:router:start:reloadsw
```

- `Auto update` with `Periodic service worker updates`:
```shell
pnpm run example:react:router:start:claims:reloadsw
```

## injectManifest

`injectManifest` has the following behavior:
- Custom `TypeScript Service Worker` with offline support.
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this behavior, execute the following script from your shell (from root folder):
```shell
pnpm run example:react:router:start:sw
```

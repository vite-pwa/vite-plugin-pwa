---
title: Vue | Examples
---

# Vue

The `Vue 3` example project can be found on `examples/vue-router` package/directory.

The router used on this example project is [vue-router](https://next.router.vuejs.org/) <outbound-link />.

The `Vue 3` example has been created using `create-vite` template with `PNPM`:
```shell
pnpx create-vite
+ create-vite 2.5.4
√ Project name: ... vue-router
√ Select a framework: » vue
√ Select a variant: » vue-ts

Scaffolding project in examples\vue-router...

Done. Now run:

  cd vue-router
  npm install
  npm run dev
```

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:
<HeuristicWorkboxWindow />

## Executing the examples

<RunExamples />

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

## injectManifest

`injectManifest` has the following behavior:
- Custom `TypeScript Service Worker` with offline support.
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.
- 

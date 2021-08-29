---
title: Svelte | Examples
---

# Svelte

All `Svelte` example projects can be found on `examples` package/directory and start with `svelte-` prefix.

All `Svelte` examples have been created using `create-vite` template with `PNPM`:
```shell
pnpx create-vite
+ create-vite 2.5.4
√ Project name: ... svelte-basic
√ Select a framework: » svelte
√ Select a variant: » svelte-ts

Scaffolding project in examples\svelte-basic...

Done. Now run:

  cd svelte-basic
  npm install
  npm run dev
```

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:
<HeuristicWorkboxWindow />

## Basic

This example project can be found on `examples/svelte-basic` package/directory with the following behavior:
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this example project, execute the following script from your shell (from root folder):
```shell
pnpm run example:svelte:start
```

## Router

The router used on this example project is [@roxi/routify](https://routify.dev/) <outbound-link />.

This example project can be found on `examples/react-routify` package/directory with the following behaviors:
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

To run this example project, execute one of the following scripts from your shell (from root folder):
- `Prompt for update`:
```shell
pnpm run example:svelte:routify:start
```

- `Auto update`:
```shell
pnpm run example:svelte:routify:start:claims
```

- `Prompt for update` with `Periodic service worker updates`:
```shell
pnpm run example:svelte:routify:start:reloadsw
```

- `Auto update` with `Periodic service worker updates`:
```shell
pnpm run example:svelte:routify:start:claims:reloadsw
```

## injectManifest

This example project can be found on `examples/svelte-basic-inject-manifest` package/directory with the following behavior:
- Custom `TypeScript Service Worker`.
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this example project, execute the following script from your shell (from root folder):
```shell
pnpm run example:svelte:start:sw
```




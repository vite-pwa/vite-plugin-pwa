---
title: SolidJS | Examples
---

# SolidJS

All `SolidJS` example projects can be found on `examples` package/directory and start with `solid-` prefix.

All `SolidJS` examples have been created using `https://github.com/solidjs/templates` template with `NPX`:
```shell
npx degit solidjs/templates/ts-minimal solid-basic
> cloned solidjs/templates#HEAD to solid-basic
```

```shell
npx degit solidjs/templates/ts-minimal solid-basic-inject-manifest
> cloned solidjs/templates#HEAD to solid-basic-inject-manifest
```

```shell
npx degit solidjs/templates/ts-router solid-router
> cloned solidjs/templates#HEAD to solid-router
```

To test `new content available`, you should rerun the corresponding script, and then refresh the page.

If you are running an example with `Periodic SW updates`, you will need to wait 1 minute:
<HeuristicWorkboxWindow />

## Basic

This example project can be found on `examples/solid-basic` package/directory with the following behavior:
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this example project, execute the following script from your shell (from root folder):
```shell
pnpm run example:solid:start
```

## Router

The router used on this example project is [solid-app-router](https://github.com/solidjs/solid-app-router) <outbound-link />.

This example project can be found on `examples/solid-router` package/directory with the following behaviors:
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
pnpm run example:solid:router:start
```

- `Auto update`:
```shell
pnpm run example:solid:router:start:claims
```

- `Prompt for update` with `Periodic service worker updates`:
```shell
pnpm run example:solid:router:start:reloadsw
```

- `Auto update` with `Periodic service worker updates`:
```shell
pnpm run example:solid:router:start:claims:reloadsw
```

## injectManifest

This example project can be found on `examples/solid-basic-inject-manifest` package/directory with the following behavior:
- Custom `TypeScript Service Worker`.
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this example project, execute the following script from your shell (from root folder):
```shell
pnpm run example:solid:start:sw
```


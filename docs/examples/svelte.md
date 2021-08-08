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
> Since `workbox-window` uses a time-based `heuristic` algorithm to handle service worker updates, if you
build your service worker and register it again, if the time between last registration and the new one is less than
1 minute, then, `workbox-window` will handle the `service worker update found` event as an external event, and so the
behavior could be strange (for example, if using `prompt`, instead showing the dialog for new content available, the
ready  to work offline dialog will be shown; if using `autoUpdate`, the ready to work offline dialog will be shown and
shouldn't be shown).

## Basic

This example project can be found on `examples/svelte-basic` package/directory with the following behavior:
- Show `Ready to work offlline` on first visit and once the `service worker` ready.
- Show `Prompt for update` when new `service worker` available.

To run this example project, execute the following script from your shell (from root folder):
```shell
pnpm run example:svelte:start
```

## Router

The router used on this example project is `@roxi/routify`.

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

> Work in progress: coming soon.


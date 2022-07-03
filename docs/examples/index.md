---
title: Getting Started | Examples
prev: Astro | Frameworks
---

# Getting Started

You can find a set of examples projects on [Vite Plugin PWA GitHub repo](https://github.com/antfu/vite-plugin-pwa/tree/main/examples).

All the examples projects are under `examples` package/directory of the repo root directory.

::: info
The main purpose of these examples projects is to test the service worker and not to meet the [PWA Minimal Requirements](/guide/#pwa-minimal-requirements), that is, if you use any of these examples for your projects, you will need to modify the code supplied and then test that it meets the [PWA Minimal Requirements](/guide/#pwa-minimal-requirements). Almost all the examples projects should meet [PWA Minimal Requirements](/guide/#pwa-minimal-requirements), but you must check it on your target project.

All the examples projects use `@rollup/plugin-replace` to configure a timestamp initialized to `now` on each build, and so, the service worker will be regenerated/versioned on each build: this timestamp will help us since the service worker won't be regenerated/versioned if none source code changed (on your project you shouldn't want this behavior,  you should want to only regenerate/version the service worker when your source code change).
:::

::: warning TRY TO AVOID INCLUDING AUTOMATIC TIMESTAMP ON YOU APPLICATION IF YOU DON'T CHANGE YOUR CODE
We use the timestamp in the examples projects to avoid having to touch a file each time we need to test: for example, to test `Prompt for update`, we need to install the service worker first time (first build), then rebuild and restart the example project and finally refresh the browser to check the `Prompt for update` is shown.
:::

## How to run examples projects?

If you want to run any of the examples projects you will need to download/clone to your local machine the `Vite Plugin PWA GitHub repo`.

You will need `node 14` (or newer) to be able to build the `Vite Plugin PWA`.

::: warning
Before following the instructions below, read the [Contribution Guide](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md).
:::

If you don't have installed `PNPM`, you must install it globally via `npm`:
```shell
npm install -g pnpm
```

Once the repo is on your local machine, you must install project dependencies and build the `vite-plugin-pwa` plugin, just run (from `vite-plugin-pwa` directory cloned locally):

```shell
pnpm install
pnpm run build
```

We use `PNPM` but should work with any `package manager`, for example, with `YARN`:
```shell
yarn && yarn build
```

::: info
From here on, we will only show the commands to run the examples projects using `PNPM`, we leave it to you how to execute them with any other` package manager`.
:::

Before we start running the examples projects, you should consider the following:
- Use `Chromium based` browser: `Chrome`, `Chromium` or `Edge`
- All the examples that are executed in this guide will be done over https, that is, all the projects will respond at address `https://localhost`
- When testing an example project, the `service worker` will be installed in `https://localhost`, and so, subsequent tests in another examples projects may interfere with the previous test, because the `service worker` of the previous project will keep installed on the browser
- Tests should be done on a private window, and so, browser addons/plugins will not interfere with the test

To avoid `service worker` interference, you should do the following tasks when switching between examples projects:
- Open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on `Windows/Linux`)
- Go to `Application > Storage`, you should check following checkboxes:
  - Application: [x] Unregister service worker
  - Storage: [x] Local and session storage
  - Cache: [x] Cache storage and [x] Application cache
- Click on `Clear site data` button
- Go to `Application > Service Workers` and check the current `service worker` is missing or has the state `deleted`

Once we remove the `service worker`, run the corresponding script and just press browser `Refresh` button (or enter `https://localhost` on browser address).

## How to test the examples projects Offline?

To test any of the examples projects (or your project) on `offline`, just open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on  `Windows/Linux`) and go to `Application > Network`, then locate `No throttling` selector: open it and select `Offline` option.

A common pitfall is to select `Offline` option, then restart the example project (or your project), and refresh the page. In that case, you will have unexpected behavior, and you should remove the service worker.

If you click the browser `Refresh` button, you can inspect `Application > Network` tab on `dev tools` to check that the `Service Worker` is serving all assets instead request them to the server.

::: danger
Don't do a `hard refresh` since it will force the browser to go to the server, and then you will get `No internet connection` page.
:::

## Available Examples Projects

<RunExamples />

We provide the following examples projects:
- [Vue 3](/examples/vue)
  - [Vue 3 generateSW Router Examples](/examples/vue#generatesw): set of examples with disparate behaviors.
  - [Vue 3 injectManifest Router Examples](/examples/vue#generatesw): set of examples with disparate behaviors.
- [React](/examples/react)
  - [React generateSW Router Examples](/examples/react#generatesw): set of examples with disparate behaviors.
  - [React injectManifest Router Examples](/examples/react#generatesw): set of examples with disparate behaviors.
- [Svelte](/examples/svelte)
  - [Svelte generateSW Router Examples](/examples/svelte#generatesw): set of examples with disparate behaviors.
  - [Svelte injectManifest Router Examples](/examples/svelte#generatesw): set of examples with disparate behaviors.
- [SvelteKit](/examples/sveltekit)
  - [SvelteKit generateSW Examples](/examples/sveltekit#generatesw): set of examples with disparate behaviors.
  - [SvelteKit injectManifest Examples](/examples/sveltekit#generatesw): set of examples with disparate behaviors.
- [SolidJS](/examples/solidjs)
  - [SolidJS generateSW Router Examples](/examples/solidjs#generatesw): set of examples with disparate behaviors.
  - [SolidJS injectManifest Router Examples](/examples/solidjs#generatesw): set of examples with disparate behaviors.
- [Preact](/examples/preact)
  - [Preact generateSW Router Examples](/examples/preact#generatesw): set of examples with disparate behaviors.
  - [Preact injectManifest Router Examples](/examples/preact#generatesw): set of examples with disparate behaviors.
- [VitePress](/examples/vitepress): prompt for update.
- [îles](/examples/iles): prompt for update.
- [Astro](/examples/astro): coming soon (WIP).


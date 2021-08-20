---
title: Getting Started | Examples
---

# Getting Started

You can find a set of example projects on [Vite Plugin PWA GitHub repo](https://github.com/antfu/vite-plugin-pwa/tree/main/examples) <outbound-link />.

All the example projects are under `examples` package/directory of the repo root directory.

> The main purpose of these example projects is to test the service worker and not to meet the `PWA requeriments`, 
that is, if you use any of these examples for your projects, you will need to modify the code supplied and then test 
that meet the `PWA requeriments`. Almost all example projects should meet `PWA requeriments` but you must check it on 
your target project.

> All example projects use `@rollup/plugin-replace` to configure a timestamp initialized to `now` on each build, and so,
the service worker will be regenerated/versioned on each build: this timestamp will help us since the service worker 
won't be regenerated/versioned if none source code changed (on your project you shouldn't want this behavior, 
you should want to only regenerate/version the service worker when your source code change).

> **TRY TO AVOID INCLUDING AUTOMATIC TIMESTAMP ON YOU APPLICATION IF YOU DON'T CHANGE YOUR CODE**. 
We use the timestamp in example projects to avoid having to touch a file each time we need to test: for example, to test 
`Prompt for update`, we need to install the service worker first time (first build), then rebuild and restart the 
example project and finally refresh the browser to check the `Prompt for update` is shown.

## How to run example projects?

If you want to run any of the example projects you will need to download/clone to your local machine the 
`Vite Plugin PWA GitHub repo`.

You will need `node 12` to be able to build the `Vite Plugin PWA`.

Once the repo is on your local machine, you must install project dependencies and build the `Vite Plugin PWA`, 
just run (from root directory):
```shell
pnpm install && pnpm run build
```

If you don't have installed `PNPM`, you must install it globally via `npm`:
```shell
npm install -g pnpm
```

We use `PNPM` but should work with any `package manager`, for example, with `YARN`:
```shell
yarn && yarn build
```

> From here on, we will only show the commands to run the example projects using `PNPM`, we leave it to you how to 
execute them with any other` package manager`.

Before we start running the sample projects, you should consider the following:
- Use `Chromium based` browser: `Chrome`, `Chromium` or `Edge`.
- All the examples that are executed in this guide will be done over https, that is, all the projects will respond 
at address `https://localhost`
- When testing an example project, the `service worker` will be installed in `https://localhost`, and so, subsequent 
tests in other example projects may interfere with the previous test, because the `service worker` of the previous 
project keep installed on the browser.
- Tests should be done on a private window, and so, browser addons/plugins will not interfere with the test.

To avoid `service worker` interference, you should do the following tasks when switching between example projects:
- Open `dev tools` (`Option + ⌘ + J` on `macOS`, `Shift + CTRL + J` on `Windows/Linux`)
- Go to `Application > Storage`, you should check following checkboxes:
  - Application: [x] Unregister service worker
  - Storage: [x] Local and session storage
  - Cache: [x] Cache storage and [x] Application cache
- Click on `Clear site data` button
- Go to `Application > Service Workers` and check the current `service worker` is missing or has the state `deleted`.

Once we remove the `service worker`, run the corresponding script and just press browser `Refresh` button (or enter
`https://localhost` on browser address).

## How to test example projects Offline?

To test any example projects (or your project) on `offline`, just open `dev tools` (`Option + ⌘ + J` on `macOS`, 
`Shift + CTRL + J` on  `Windows/Linux`) and go to `Application > Network`, then locate `No throttling` selector: open 
it and select `Offline` option.

A common mistake is to select `Offline` option, then restart the example project (or your project), and refresh the 
page. In that case, you will have unexpected behavior, and you should remove the service worker.

If you click the browser `Refresh` button, you can inspect `Application > Network` tab on `dev tools` to see that
the `Service Worker` is serving all assets instead request them to the server.

> Don't do a `hard refresh` since this will force the browser to go to the server, and then you will get 
`No internet connection` page on browser.

## Available Example Projects

We provide the following example projects:

<ul aria-describedby="available-example-projects">
<md-list-anchor id="vue-examples" href="/examples/vue.html">
  <template #link>Vue 3</template>
  <template #nested>
    <ul aria-describedby="vue-examples">
      <md-list-anchor href="/examples/vue.html#basic">
        <template #link>Vue 3 Basic Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/vue.html#router">
        <template #link>Vue 3 Router Examples</template>
        <template #trailing>: set of examples with disparate behaviors.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/vue.html#injectmanifest">
        <template #link>Vue 3 injectManifest Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
    </ul>
  </template>
</md-list-anchor>
<md-list-anchor id="svelte-examples" href="/examples/svelte.html">
  <template #link>Svelte</template>
  <template #nested>
    <ul aria-describedby="svelte-examples">
      <md-list-anchor href="/examples/svelte.html#basic">
        <template #link>Svelte Basic Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/svelte.html#router">
        <template #link>Svelte Router Examples</template>
        <template #trailing>: set of examples with disparate behaviors.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/svelte.html#injectmanifest">
        <template #link>Svelte injectManifest Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
    </ul>
  </template>
</md-list-anchor>
<md-list-anchor id="react-examples" href="/examples/react.html">
  <template #link>React</template>
  <template #nested>
    <ul aria-describedby="react-examples">
      <md-list-anchor href="/examples/react.html#basic">
        <template #link>React Basic Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/react.html#router">
        <template #link>React Router Examples</template>
        <template #trailing>: set of examples with disparate behaviors.</template>
      </md-list-anchor>
      <md-list-anchor href="/examples/react.html#injectmanifest">
        <template #link>React injectManifest Example</template>
        <template #trailing>: <code>Ready to work offline</code> and <code>Prompt for update</code>.</template>
      </md-list-anchor>
    </ul>
  </template>
</md-list-anchor>
<md-list-anchor href="/examples/vitepress.html">
  <template #link>VitePress</template>
  <template #trailing>: <code>Prompt for update</code>.</template>
</md-list-anchor>
</ul>

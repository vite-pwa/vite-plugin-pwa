---
title: Prompt for new content refreshing | Guide
---

# Prompt for new content refreshing

<prompt-for-update-img />

## Plugin Configuration

Since this is the default behavior for the `registerType` plugin option, you don't need to configure it.

### Cleanup Outdated Caches

<CleanupOutdatedCaches />

<GenerateSWCleanupOutdatedCaches />

### Generate SW Source Map

<GenerateSWSourceMap />

## Importing Virtual Modules

You must include the following code on your `main.ts` or `main.js` file:
```ts
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})
```

You will need to:
- show a prompt to the user with refresh and cancel buttons inside `onNeedRefresh` method.
- show a ready to work offline message to the user with an OK button inside `onOfflineReady` method.

When the user clicks the "refresh" button when `onNeedRefresh` called, then call `updateSW()` function; the page will reload and the up-to-date content will be served.

In any case, when the user clicks the `Cancel` or `OK` buttons in case `onNeedRefresh` or `onOfflineReady` respectively, close the corresponding showed prompt.

### SSR/SSG

<SsrSsg />


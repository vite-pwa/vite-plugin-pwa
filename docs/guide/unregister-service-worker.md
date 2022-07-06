---
title: Unregister Service Worker | Guide
---

# Unregister Service Worker

If you want to unregister the service worker from your PWA application, you only need to add `selfDestroying: true` to the plugin configuration.

::: danger
It is **IMPORTANT TO NOT CHANGE ANYTHING** in the plugin configuration (especially **DO NOT CHANGE THE SERVICE WORKER NAME**), just keep the options and the PWA UI components (if included some toast/dialog for ready to work offline or prompt for update), the plugin will take care of changing the service worker and avoid interacting with the UI if configured.
:::

In a future, if you want to add the PWA again to your application, you only need to remove the `selfDestroying` option or just disable it: `selfDestroying: false`.

## Development

You can also check the `selfDestroying` plugin option in the dev server with development options enabled: check [Development section](/guide/development) for more info.

## Examples

You have in the examples folder the `**-destroy` scripts in its corresponding `package.json`, you can test it in dev server or from production build.

# Workbox

## Introduction

**Workbox** is a huge package with a lot of modules to just make service worker development not to be a hassle and avoid 
dealing with low level service worker api.

In this document we focus only on 
[workbox-build](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build) <outbound-link /> 
module from **Workbox**.

### workbox-build module

This module is for build process purpose (is is a `node` module), that is, `Vite Plugin PWA` will use it to build your service.

We focus on 2 methods of this module:
- [generateWS](/workbox/generate-ws): for generating the service worker.
- [injectManifest](/workbox/inject-manifest): to build your own service worker.

You must read [Which Mode to Use](https://developers.google.com/web/tools/workbox/modules/workbox-build#which_mode_to_use) <outbound-link />
before decide what strategy to use.

`generateWS` method will abstract you from using service worker api when building the service worker. 
This method can be configured using plugins instead writing your own service worker code (`generateWS` will generate 
the code for you).

`injectManifest` method will get your custom service worker and build/compile it.

### How is `workbox-build` related to `vite-plugin-pwa`?

`vite-plugin-pwa` will use internally `generateWS` and `injectManifest` `workbox` methods when `strategies` 
option is `generateWS` and `injectManifest` respectively.

When you configure `strategies: 'generateWS'` (it is the default value) option on your `vite.config.ts`, then the 
plugin invoke  the workbox `generateWS` method: the options passed to the `workbox` method will be the provided on 
the plugin configuration.

When you configure `strategies: 'injectManifest'` plugin option on your `vite.config.ts`, then the plugin will first 
build your custom service worker via `rollup` and then, with previous build result will call to workbox `injectManifest` 
method: the options passed to the `workbox` method will be the provided on the plugin configuration.

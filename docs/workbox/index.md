# Workbox

## Introduction

**Workbox** is a huge package with a lot of modules to just make service worker development not to be a hassle and avoid 
dealing with low level service worker api.

In this document we will focus only on 
[workbox-build](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build) <outbound-link /> 
module from **Workbox**.

### workbox-build module

This module is for build process purpose, that is, `Vite Plugin PWA` will use it to build your service.

We will focus on 2 methods from `workbox-build` module:
- [generateWS](/workbox/generate-ws): for generating the service working
- [injectManifest](/workbox/inject-manifest): to build your own service worker



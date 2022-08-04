---
title: Cloudflare Pages | Deployment
---

# Cloudflare Pages

## Configure `manifest.webmanifest` mime type

You need to register the correct MIME type for the web manifest by adding a headers entry to your `_headers` file (see basic deployment below):
```
/manifest.webmanifest
  Content-Type: application/manifest+json
```

## Cache-Control

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

Add row to your `_headers` file (see basic deployment below):

```
/
  Cache-Control: public, max-age=0, s-maxage=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/workbox-*
  Cache-Control: public, max-age=31536000, immutable
```

## Configure http to https redirection

Cloudflare Pages will redirect automatically, so you don't worry about it.

## Basic deployment example

Add `_headers` file to the build output root directory. Note that your output root directory probably won't be the root of your project itself. For example, in a Vue 3 project you'd create this file at `public/_headers`.

```
/
  Cache-Control: public, max-age=0, s-maxage=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/workbox-*
  Cache-Control: public, max-age=31536000, immutable

/manifest.webmanifest
  Content-Type: application/manifest+json
```

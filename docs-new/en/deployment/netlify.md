---
title: Netlify | Deployment
---

# Netlify

## Configure `manifest.webmanifest` mime type

You need to register the correct MIME type for the web manifest by adding a headers table to your `netlify.toml` file (see basic deployment below):
```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

## Cache-Control

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

Add another headers table to your `netlify.toml` file (see basic deployment below):

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```

## Configure http to https redirection

Netlify will redirect automatically, so you don't worry about it.

## Basic deployment example

Add `netlify.toml` file to the root directory with the content:

```toml
[build.environment]
  NPM_FLAGS = "--prefix=/dev/null"
  NODE_VERSION = "14"

[build]
  publish = "dist"
  command = "npx pnpm i --store=node_modules/.pnpm-store && npx pnpm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = '''
    max-age=31536000,
    immutable
    '''
```

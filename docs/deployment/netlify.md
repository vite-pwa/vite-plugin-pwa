# Netlify

## Configure `manifest.webmanifest` mime type

You need to configure the header entry on `netlify.toml` file (see basic deployment bellow):
```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

## Configure http to https redirection

Netlify will redirect automatically, so you don't worry about it.

## Basic deployment example

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
```

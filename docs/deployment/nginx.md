---
title: NGINX | Deployment
---

# NGINX

## Configure `manifest.webmanifest` mime type

You should check if your `NGINX` server has the `manifest.webmanifest` mime type configured, check `/etc/nginx/mime.types`
(default mime configuration file):

```ini
# /etc/nginx/mime.types
types {
  ...
  ...
  # Manifest files
  application/manifest+json  webmanifest;
  ...
  ...
}
```

## Basic configuration with http to https redirection

Update your `server.conf` configuration file with:

```ini
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}
```

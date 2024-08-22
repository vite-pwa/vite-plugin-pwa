---
title: NGINX | Deployment
---

# NGINX

## Configure `manifest.webmanifest` mime type

You need to register the correct MIME type for the web manifest by adding it either to the [default](https://www.nginx.com/resources/wiki/start/topics/examples/full/#mime-types) file at `/etc/nginx/mime.types`

```nginx
# /etc/nginx/mime.types
types {
  # Manifest files
  application/manifest+json  webmanifest;
  ... 
}
```

or any `http`, `server` or location `location` block with


```nginx
types {
  application/manifest+json  webmanifest;
}
```

You can validate the setting by checking the HTTP headers once the app is deployed

```shell script
curl -s -I -X GET https://yourserver/manifest.webmanifest | grep content-type -i
```

and check that the result is `content-type: application/manifest+json`.

## Basic configuration with http to https redirection

Update your `server.conf` configuration file with:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}
```

## Cache-Control

Ensure you have a very restrictive setup for your `Cache-Control` headers in place.

Double check that **you do not** have caching features enabled, especially `immutable`, on locations like:

- `/`
- `/sw.js`
- `/index.html`
- `/manifest.webmanifest`

NGINX will add `E-Tag`-headers itself, so there is not much to in that regard.

As a general rule, files in `/assets/` can have a very long cache time, as everything in there should contain a hash in the filename.

An example configuration inside your `server` block could be:

```nginx
# all assets contain hash in filename, cache forever
location ^~ /assets/ {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# all workbox scripts are compiled with hash in filename, cache forever3
location ^~ /workbox- {
    add_header Cache-Control "public, max-age=31536000, s-maxage=31536000, immutable";
    ...
    try_files $uri =404;
}

# assume that everything else is handled by the application router, by injecting the index.html.
location / {
    autoindex off;
    expires off;
    add_header Cache-Control "public, max-age=0, s-maxage=0, must-revalidate" always;
    ...
    try_files $uri /index.html =404;
}
```

Be aware that this is a very simplistic approach and you must test every change, as the NGINX match precedences for locations are not very intuitive and error prone if you do not know the [exact rules](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/#location_priority).

::: danger
**Always re-test and re-assure** that the caching for mission critical files is **as low** as possible if not hashed files or you might invalidate clients for a long time.
:::

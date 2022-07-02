---
title: Apache Http Server 2.4+ | Deployment
next: Getting Started | Workbox
---

# Apache Http Server 2.4+

## Configure `manifest.webmanifest` mime type

You need to configure the following mime type (see basic configuration below):

```ini
<IfModule mod_mime.c>
   # Manifest file
   AddType application/manifest+json webmanifest
</IfModule>
```

## Basic configuration with http to https redirection

Update your `httpd.conf` configuration file with:

```ini
# httpd.conf
ServerRoot "<your apache server root>"

Listen 80
ServerName www.yourdomain.com

DocumentRoot "<your document root>"

# modules
LoadModule mime_module modules/mod_mime.so
LoadModule rewrite_module modules/mod_rewrite.so

# mime types
<IfModule mod_mime.c>
   # Manifest file
   AddType application/manifest+json webmanifest
</IfModule>

# your https configuration
Include conf/extra/https-www.yourdomain.com.conf

<IfModule ssl_module>
    SSLRandomSeed startup builtin
    SSLRandomSeed connect builtin
</IfModule>

<VirtualHost www.yourdomain.com:80>
    ServerName www.yourdomain.com
    
    RewriteEngine On
    
    # disable TRACE and TRACK methods
    RewriteCond %{REQUEST_METHOD} ^(TRACE|TRACK)
    RewriteRule .* - [F]
    
    Options +FollowSymlinks
    RewriteCond %{SERVER_PORT} !443
    
    RewriteRule (.*) https://www.yourdomain.com/ [L,R]
    
    ErrorLog logs/www.yourdomain.com-error_log
    CustomLog logs/www.yourdomain.com-access_log combined
</VirtualHost>
```

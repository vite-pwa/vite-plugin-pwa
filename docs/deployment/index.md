# Deployment

## Overview

Since you need to install your application as a [Progressive Web App](https://web.dev/progressive-web-apps/) <outbound-link />
you must configure your server to meet PWA requirements, that is, your server must:

- serve `manifest.webmanifest` with mime type `application/manifest+json`
- you must serve your application over `https`: you must also redirect from `http` to `https`

## Servers

- [Netlify](/deployment/netlify)
- [Vercel](/deployment/vercel)
- [AWS Amplity](/deployment/aws)
- [Apache Http Server 2.4+](/deployment/apache)

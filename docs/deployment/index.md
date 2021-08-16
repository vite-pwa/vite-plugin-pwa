---
title: Getting Started | Deployment
---

# Getting Started

Since you need to install your application as a [Progressive Web App](https://web.dev/progressive-web-apps/) <outbound-link />
you must configure your server to meet PWA requirements, that is, your server must:

- serve `manifest.webmanifest` with mime type `application/manifest+json`
- you must serve your application over `https`: you must also redirect from `http` to `https`

## Servers

- [Netlify](/deployment/netlify)
- [AWS Amplity](/deployment/aws)
- [Vercel](/deployment/vercel)
- [NGINX](/deployment/nginx)
- [Apache Http Server 2.4+](/deployment/apache)


## Testing your application on production

Once you deploy your application to your server, you can test it using [WebPageTest](https://www.webpagetest.org/) <outbound-link />.
There are many test sites, but we suggest you use `WebPageTest` as this is the most comprehensive in terms of test: 
- Security.
- First byte time.
- Keep alive enabled.
- Compress transfer. 
- Cache static content.
- Effective use of CDN.
- Lighthouse: Core Web Vitals, Performance, Images size optimization...
- And more...

Enter the url of your application, click `Start Test` button, wait for the test to finish, the `WebPageTest` result 
will hint you what things on your application must be fixed/changed. The `WebPageTest` result will also score your application,
it will also test your site with `Lighthouse`.

For example, go to [WebPageTest](https://www.webpagetest.org/) <outbound-link />, enter `https://vite-plugin-pwa.netlify.app/`,
click `Start Test` button, wait a few seconds for the test to finish, and see the results for this site.

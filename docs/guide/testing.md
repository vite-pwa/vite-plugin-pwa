# Testing Service Worker

Since this plugin will not generate the service worker on `development`, you can test it on local following these steps:

1) add `serve` script to your `package.json` or modify existing with:
```json
"serve": "vite preview"
```
2) build your app and run `serve`: `npm run build && npm run serve`.

## Testing Service Worker over https

If you want to test your service worker using `https`, follow these steps:

1) add `https-localhost` as `dev dependency`:
```shell
# YARN
yarn add https-localhost -D
```

```shell
# NPM
npm i https-localhost -D
```

```shell
# PNPM
pnpm i https-localhost -D
```

2) add `https-preview` script to your `package.json`:
```json
"https-preview": "serve dist"
```

3) build your app and run `https-preview`:
```shell
# YARN
yarn build && yarn https-preview
```

```shell
# NPM
npm run build && npm run https-preview`
```

```shell
# PNPM
pnpm run build && pnpm run https-preview`
```

First time you run the script, `https-localhost`  will ask you about installing `localhost` certificate 
(that will be generated for you), confirm installation on OS (keychain on MACOSX and certificate manager on WINDOWS)
and open `https://localhost` on browser.

If you would like to know more, go to [https-localhost](https://www.npmjs.com/package/https-localhost) <outbound-link />.


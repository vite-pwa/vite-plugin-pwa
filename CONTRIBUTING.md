# Contributing Guide

Hi! We are really excited that you are interested in contributing to `vite-plugin-pwa`. Before submitting your contribution, please make sure to take a moment and read through the following guide.

Refer also to https://github.com/antfu/contribute.
## Set up your local development environment

The `vite-plugin-pwa` repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test the `vite-plugin-pwa` package:

1. Fork the `vite-plugin-pwa` repository to your own GitHub account and then clone it to your local device.

2. Ensure using the latest Node.js (16.x)

3. `vite-plugin-pwa` uses pnpm v7. If you are working on multiple projects with different versions of pnpm, it's recommend to enable [Corepack](https://github.com/nodejs/corepack) by running `corepack enable`.

4. Check out a branch where you can work and commit your changes:
```shell
git checkout -b my-new-branch
```

5. Run `pnpm i` in `vite-plugin-pwa`'s root folder

6. Run `pnpm run build` in `vite-plugin-pwa`'s root folder.

## Testing changes

The `vite-plugin-pwa` repo includes a set of examples where you can test the changes (you can find them on examples folder), you should check your changes against each framework using the `cli` for running examples:
- `pnpm run examples`: select `vue` framework and default options on the cli (you can also test another options)
- `pnpm run examples`: select `react` framework and default options on the cli (you can also test another options)
- `pnpm run examples`: select `preact` framework and default options on the cli (you can also test another options)
- `pnpm run examples`: select `svelte` framework and default options on the cli (you can also test another options)
- `pnpm run examples`: select `sveltekit` framework and default options on the cli (you can also test another options)
- `pnpm run examples`: select `solid` framework and default options on the cli (you can also test another options)

> The default options from the `cli` are just to check your changes are not breaking major ui/app frameworks build: `generateSW` strategy, `Prompt for update` behavior and `Enable periodic SW updates` to `no`. 

> If your changes are specific to some behavior, just use the corresponding option on the `cli`.

## Testing website docs changes

`vite-plugin-pwa` uses `Vitepress` for the website docs, if your changes are about the documentation, you can find the website on the `docs` folder. 

Once you made the changes to the documentation, you can test them running `pnpm run docs` from the root folder.

To check the website build, just run `pnpm run docs:serve` from the root folder.

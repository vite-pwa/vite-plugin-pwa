::: warning
Before following the instructions below, read the [Contribution Guide](https://github.com/antfu/vite-plugin-pwa/blob/main/CONTRIBUTING.md).
:::

Make sure you install project dependencies, and build the repo on your local clone/fork:

```shell
cd vite-plugin-pwa
pnpm install
pnpm run build
```

To run the examples, execute the following script from your shell (from root folder), it will start a CLI where you will select the framework and the pwa options:

```shell
pnpm run examples
```

If you don't run `pnpm build` first, you may see an error like, `failed to load config` or `Please verify that the package.json has a valid "main" entry`.

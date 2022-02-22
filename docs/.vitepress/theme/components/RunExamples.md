To run the examples, execute the following script from your shell (from root folder), it will start a CLI where you
will select the framework and the pwa options:

```shell
pnpm run examples
```


<details>
    <summary>Make sure you run <strong>pnpx build</strong> first</summary>

```shell
cd vite-plugin-pwa
pnpm run install  # (if you need to)
pnpm run build
pnpm run examples

```

If you don't do `pnpx run build` first,
you may see an error like, `failed to load config` or `Please verify that the package.json has a valid "main" entry`.

</details>

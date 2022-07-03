If your **TypeScript** build step or **IDE** complain about not being able to find modules or type definitions on imports, add the following to the `compilerOptions.types` array of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/client"
    ]
  }
}
```

Or you can add the following reference in any of your `d.ts` files (for example, in `vite-env.d.ts` or `global.d.ts`):
```ts
/// <reference types="vite-plugin-pwa/client" />
```

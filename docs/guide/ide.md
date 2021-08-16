---
title: IDE Support | Guide
---

# IDE Support

## IDE errors 'Cannot find module' (ts2307)

If your TypeScript build step or IDE complain about not being able to find modules or type definitions on imports, 
add the following to the `compilerOptions.types` array of your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-pwa/client"
    ]
  }
}
```

export const commands = [
  'npx tsup src/index.ts --dts --format cjs,esm',
  'npx tsup src/client/build/register.ts --format esm -d dist/client/build',
  'npx tsup src/client/build/vue.ts --external vue --format esm -d dist/client/build',
  'npx tsup src/client/build/svelte.ts --external svelte/store --format esm -d dist/client/build',
  'npx tsup src/client/dev/register.ts --format esm -d dist/client/dev',
  'npx tsup src/client/dev/vue.ts --external vue --format esm -d dist/client/dev',
  'npx tsup src/client/dev/svelte.ts --external svelte/store --format esm -d dist/client/dev',
]

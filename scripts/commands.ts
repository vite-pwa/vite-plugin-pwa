export const commands = [
  'npx tsup src/index.ts --dts --format cjs,esm',
  'npx tsup src/client/register.ts --dts --format esm -d dist/client',
  'npx tsup src/client/vue.ts --external vue --format esm -d dist/client',
]

export function stringify(data: any) {
  return JSON.stringify(data, null, 2).replace(
    /"(\w+)":/g, '$1:',
  ).replace(
    /"/g, '\'',
  )
}

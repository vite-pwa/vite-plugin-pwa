<template>
  <form grid="~ cols-[1fr] gap-y-1rem" v-bind="$attrs" novalidate>
    <PBErrors />
    <slot name="inputs" />
    <div
      pt-6 mt-6
      border-t="~ base $vp-c-divider-light"
      grid="~ cols-[minmax(auto,9em)_minmax(auto,9em)] gap-x-1rem lt-xs:cols-[1fr] lt-xs:gap-y-1rem"
    >
      <slot name="buttons" />
    </div>
  </form>
</template>

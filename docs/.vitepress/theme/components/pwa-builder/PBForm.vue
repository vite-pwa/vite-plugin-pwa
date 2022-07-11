<template>
  <form grid="~ cols-[1fr] gap-y-1rem" v-bind="$attrs" novalidate>
    <PBErrors />
    <slot name="inputs" />
    <br border="~ solid">
    <slot name="buttons" />
  </form>
</template>

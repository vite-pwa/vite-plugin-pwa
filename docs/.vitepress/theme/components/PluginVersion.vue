<script setup lang="ts">
// replace dinamically
const pwaVersion = '__PWA_VERSION__'
const version = `PWA build version: v${pwaVersion}`
</script>

<template>
  <svg
    class="pwa-version"
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="20"
    role="img"
    :aria-label="version"
  >
    <title>{{ version }}</title>
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
      <stop offset="1" stop-opacity=".1" />
    </linearGradient>
    <clipPath id="r">
      <rect width="45" height="20" rx="3" fill="#fff" />
    </clipPath>
    <g clip-path="url(#r)" class="primary">
      <rect width="0" height="20" class="primary" />
      <rect x="0" width="45" height="20" class="primary" />
      <rect width="45" height="20" fill="url(#s)" />
    </g>
    <g
      fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
      text-rendering="geometricPrecision" font-size="110"
    >
      <text aria-hidden="true" x="225" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="350">
        {{ version }}
      </text>
      <text x="225" y="140" transform="scale(.1)" fill="#0c0c0c" textLength="350">{{ version }}</text>
    </g>
  </svg>
</template>

<style scoped>
svg.pwa-version > *.primary {
  fill: var(--pwa-logo-w);
}
</style>

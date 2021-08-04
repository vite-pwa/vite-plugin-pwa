<script setup lang="ts">
import { useEditLink } from '../composables/editLink'

const { url, text } = useEditLink()
</script>

<template>
  <div class="edit-link">
    <a v-if="url" class="link" :href="url" target="_blank" rel="noopener noreferrer">
      <carbon-edit class="align-middle" style="opacity:0.75" /> {{ text }}
    </a>
  </div>
</template>

<style scoped>
.link {
  display: inline-block;
  font-size: 1rem;
  color: var(--c-text);
}

.link:hover {
  text-decoration: none;
}

.edit-link {
  opacity: 0.75;
  font-weight: 400;
}

.edit-link:hover {
  opacity: 1;
}

.edit-link:hover a {
  color: var(--c-text) !important;
}
</style>

<script setup lang="ts">
const promptImage = '__PROMPT_URL__'
</script>

<template>
  <p class="prompt-img">
    <img :src="promptImage" alt="Prompt for update for new content dialog image with the update and cancel button" width="720" height="178" loading="lazy">
  </p>

</template>

<style scoped>
.prompt-img {
  text-align: center;
  img {
    object-fit: scale-down;
    filter: var(--hero-filter);
  }
}
</style>

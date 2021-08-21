<script setup lang="ts">
import { withBase } from 'vitepress'
import { useNextAndPrevLinks } from '../composables/nextAndPrevLinks'

const { hasLinks, prev, next } = useNextAndPrevLinks()
</script>

<template>
  <div v-if="hasLinks" class="next-and-prev-link">
    <div class="container" :class="!next || !prev ? 'empty' : null">
      <div class="prev" :class="prev ? ull : 'empty'">
        <a v-if="prev" class="link" :href="withBase(prev.link)">
          <ArrowLeft class="icon icon-prev" />
          <span class="text">{{ prev.useLinkText ? prev.useLinkText : prev.text }}</span>
        </a>
      </div>
      <div class="next" :class="next ? null : 'empty'">
        <a v-if="next" class="link" :href="withBase(next.link)">
          <span class="text">{{ next.useLinkText ? next.useLinkText : next.text }}</span>
          <ArrowRight class="icon icon-next" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.next-and-prev-link {
  padding-top: 1rem;
}
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 0.5rem;
  border-top: 1px solid var(--c-divider);
  padding-top: 1rem;
  min-height: 48px;
  width: 100%;
}
.container.empty {
  grid-row-gap: 0;
}
.prev,
.next {
  display: flex;
  justify-content: center;
  min-height: 48px;
  padding: 0 0.5rem;
}
.prev.empty,
.next.empty {
  max-height: 0;
  min-height: 0;
}
.link {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 0.5rem;
}
.text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: var(--c-text);
  transform: translateY(1px);
}
.icon-prev {
  margin-right: 8px;
}
.icon-next {
  margin-left: 8px;
}
@media (min-width: 915px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    grid-row-gap: 0;
  }
  .prev,
  .next {
    flex-shrink: 0;
  }
  .prev {
    justify-content: flex-start;
    padding-right: 1rem;
  }
  .next {
    justify-content: flex-end;
    padding-left: 1rem;
  }
}
</style>

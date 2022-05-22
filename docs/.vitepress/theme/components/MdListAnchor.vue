<script setup lang="ts">
import { useRouter } from 'vitepress'

const props = defineProps<{
  href: string
  id?: string
  external?: boolean
}>()

const router = useRouter()
const anchor = ref(null)
const isExternal = computed(() => props.external === true)

const navigate = () => {
  if (isExternal.value)
    window.open(props.href, '_blank', 'noreferrer noopener')
  else
    router.go(props.href)
}
</script>

<template>
  <li class="li-anchor" :class="[{ external: isExternal }]">
    <div role="link" tabindex="0" class="li-anchor-container" @click="navigate" @keydown.enter="navigate">
      <span v-if="$slots.heading" class="heading-text">
        <slot name="heading" />
      </span>
      <span :id="props.id" class="li-anchor-link">
        <slot name="link" />
      </span>
      <span v-if="isExternal" class="li-anchor-external">
        <OutboundLink />
      </span>
      <span v-if="$slots.trailing" class="trailing-text">
        <slot name="trailing" />
      </span>
    </div>
    <slot name="nested" />
  </li>
</template>

<style scoped>
.li-anchor {
  min-height: 48px;
  vertical-align: middle;
  line-height: 1.5;
}
.li-anchor-container {
  min-height: 48px;
  letter-spacing: normal;
  padding: 4px 0.5rem;
  position: relative;
}
.li-anchor-container:hover {
  cursor: pointer;
}
.li-anchor-link {
  line-height: 36px;
  font-size: 1rem;
  font-weight: bolder;
  color: var(--c-brand-active);
  white-space: nowrap;
  text-decoration: none;
}
.li-anchor .li-anchor-container:hover .li-anchor-link {
  text-decoration: underline;
}
.li-anchor-link + .li-anchor-external:before {
  content: " ";
}
</style>

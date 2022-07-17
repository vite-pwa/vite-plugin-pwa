<script setup lang="ts">
import { computed, ref } from 'vue'
import { errors } from '../../composables/pwaBuilder'

const ulRef = ref<HTMLUListElement | undefined>(undefined)
const hasErrors = computed(() => {
  return errors && errors.value.length > 0
})
const focusFirstError = () => {
  ulRef.value?.querySelector<HTMLAnchorElement>('li:first-of-type a')?.focus({
    preventScroll: true,
  })
}
</script>

<template>
  <transition
    enter-active-class="pb-errors-enter"
    leave-active-class="pb-errors-leave"
  >
    <div v-if="hasErrors" role="alert" aria-labelledby="errors" class="custom-block danger important-m-0">
      <a id="errors" fw-bold href="#" @click.prevent="focusFirstError">
        You must fill in all the fields of the form:
      </a>
      <ul ref="ulRef">
        <li v-for="error of errors" :key="error.key">
          <a href="#" @click.prevent="error.focus()">{{ error.text }}</a>
        </li>
      </ul>
    </div>
  </transition>
</template>

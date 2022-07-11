<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { useState } from '../../composables/useState'
import type { BuilderError } from '../../composables/pwaBuilder'

const props = defineProps<{
  id: string
  title: string
  error: string
  modelValue?: string
}>()

defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

const validate = () => {
  const value = props.modelValue
  if (!value || value.trim().length === 0)
    return { isValid: false, message: props.error }
  else
    return { isValid: true }
}

const input = ref(undefined)
const { error, validateField } = useState(props.id, input, validate)
const errorClass = computed(() => {
  return error.value ? 'pb-error custom-block danger important-m-0' : undefined
})
</script>

<template>
  <label pb-input>
    <span
      fw-500
      text-lg
      block
      :class="error ? 'text-$vp-custom-block-danger-text' : undefined"
    >{{ title }}</span>
    <input
      :id="id"
      ref="input"
      type="text"
      autocomplete="off"
      v-bind="$attrs"
      :value="modelValue"
      :class="errorClass"
      border="~ rounded base"
      p="x2 y1"
      @blur="validateField"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </label>
</template>

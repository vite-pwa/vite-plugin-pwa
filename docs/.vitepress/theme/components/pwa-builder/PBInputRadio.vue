<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RadioData } from '../../types'
import { useState } from '../../composables/useState'
import PBRequiredField from './PBRequiredField.vue'

const props = defineProps<{
  id: string
  title: string
  error: string
  options: RadioData<any>[]
  modelValue?: any
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
const { error } = useState(props.id, input, validate)
const errorClass = computed(() => {
  return error.value ? 'pb-error text-$vp-custom-block-danger-text' : undefined
})
</script>

<template>
  <div
    :id="id"
    ref="input"
    :aria-labelledby="`${id}-label`"
    :class="error ? 'text-$vp-custom-block-danger-text' : undefined"
    grid="~ rows-[auto_1fr] gap-y-1rem"
    tabindex="-1"
  >
    <div :id="`${id}-label`" fw-500 text-lg>
      <PBRequiredField>
        {{ title }}
      </PBRequiredField>
    </div>
    <div grid="~ cols-1fr gap-y-0.5rem" items-center :class="errorClass">
      <label v-for="option of options" :key="option.value" grid="~ cols-[min-content_1fr] gap-x-0.8rem" items-center>
        <input
          v-model="/* eslint-disable */ modelValue"
          text-2rem
          w="0.7em"
          h="0.7em"
          m="0"
          :value="option.value"
          type="radio"
          :disabled="option.disabled"
          @change="$emit('update:modelValue', $event.target.value)"
        >
        <span fw-400 w-full>{{ option.text }}</span>
      </label>
    </div>
  </div>
</template>

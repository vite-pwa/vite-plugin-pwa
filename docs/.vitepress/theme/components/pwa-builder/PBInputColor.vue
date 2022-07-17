<script setup lang="ts">
import { computed, ref } from 'vue'
import { useState } from '../../composables/useState'
import PBRequiredField from './PBRequiredField.vue'

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
const { error } = useState(props.id, input, validate)
const errorClass = computed(() => {
  return error.value ? 'pb-error custom-block danger' : undefined
})
</script>

<template>
  <label pb-input>
    <span fw-500 text-lg>
      <PBRequiredField>{{ title }}</PBRequiredField>
    </span>
    <input
      :id="id"
      ref="input"
      type="color"
      v-bind="$attrs"
      :value="modelValue"
      :class="errorClass"
      border="~ rounded base"
      h-34px
      p="x2 y1"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </label>
</template>

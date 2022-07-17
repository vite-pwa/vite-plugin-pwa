import type { Ref } from 'vue'
import { nextTick, onBeforeMount, ref } from 'vue'
import type { BuilderElement, BuilderError, ValidationResult } from '../types'
import { focusInput, inputs } from './pwaBuilder'

export function useState(key: string, input: Ref, internalValidation: () => ValidationResult) {
  const error = ref(false)
  const errors = ref<BuilderError[]>([])

  const focus = () => {
    focusInput(input.value)
  }

  const withState = (withError: boolean, focusInput: boolean) => {
    error.value = withError
    focusInput && focus()
  }

  const isValid = () => {
    return !error.value
  }

  const validate = async () => {
    const { isValid, message } = internalValidation()
    let internalError: BuilderError | undefined
    if (isValid)
      errors.value.splice(0)
    else
      internalError = { key, text: message!, focus }

    if (internalError)
      errors.value.splice(0, errors.value.length, internalError)

    await nextTick()
    error.value = !isValid
    return internalError ? [internalError] : undefined
  }

  onBeforeMount(() => {
    inputs.value.push(<BuilderElement>{
      key,
      focus,
      validate,
      isValid,
      withState,
    })
  })

  return { error, errors, validateField: validate }
}

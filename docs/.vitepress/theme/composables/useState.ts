import type { Ref } from 'vue'
import { nextTick, onBeforeMount, ref } from 'vue'
import type { BuilderElement, BuilderError, ValidationResult } from './pwaBuilder'
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
    if (isValid)
      errors.value.splice(0)
    else
      errors.value.splice(0, errors.value.length, <BuilderError>{ key, focus, text: message })

    await nextTick()
    error.value = !isValid
    await nextTick()
    return errors.value
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

import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useThrottleFn } from '@vueuse/shared'
import type {
  BehaviorType,
  BuilderElement,
  BuilderError,
  FaviconType,
  FrameworkType, InjectRegisterType,
  PWABuilderData,
  RadioData,
  State,
  StrategyType,
  YesNoType,
} from '../types'

import { DEFAULT_TIMEOUT, generatePWACode, prepareBuilder, resetPWACode } from '../modules/generatePWACode'

export const focusInput = (element?: HTMLElement, to: ScrollLogicalPosition = 'nearest') => {
  setTimeout(() => element?.focus(), 0)
  setTimeout(() => element?.scrollIntoView({
    block: to,
    behavior: 'smooth',
  }), 0)
}

export const inputs = ref<BuilderElement[]>([])
export const errors = ref<BuilderError[]>([])

export function usePWABuilder() {
  const state = ref<State>('initial')
  const title = ref<string | undefined>()
  const description = ref<string | undefined>()
  const shortName = ref<string | undefined>()
  const themeColor = ref<string | undefined>('#ffffff')
  const strategy = ref<StrategyType | undefined>('generateSW')
  const behavior = ref<BehaviorType | undefined>('prompt')
  const warnUser = ref<YesNoType | undefined>('false')
  const injectRegister = ref<InjectRegisterType | undefined>(undefined)
  const periodicUpdates = ref<YesNoType | undefined>('false')
  const framework = ref<FrameworkType | undefined>(undefined)
  const ts = ref<YesNoType | undefined>(undefined)
  const scope = ref<string | undefined>('/')
  const startUrl = ref<string | undefined>(undefined)
  const maskedIcon = ref<YesNoType | undefined>('true')
  const favicon = ref<FaviconType | undefined>('ico')

  const generating = ref(false)

  const strategies = createStrategies()
  const behaviors = createBehaviors()
  const warns = createWarnReady()
  const injectRegisters = createInjectRegisters()
  const frameworks = createFrameworks()
  const yesNoList = createYesNo()
  const faviconList = createFavicons()

  const showInjectRegister = computed(() => {
    return behavior.value === 'autoUpdate' && warnUser.value === 'false'
  })

  const showTS = computed(() => {
    return !(!framework.value || framework.value === 'javascript' || framework.value === 'typescript')
  })

  const generateTypeScript = computed(() => {
    return framework.value === 'typescript' || ts.value === 'true'
  })

  const reset = async () => {
    title.value = undefined
    scope.value = '/'
    startUrl.value = undefined
    description.value = undefined
    shortName.value = undefined
    themeColor.value = '#FFFFFF'
    maskedIcon.value = 'true'
    strategy.value = 'generateSW'
    behavior.value = 'prompt'
    warnUser.value = 'false'
    injectRegister.value = undefined
    framework.value = undefined
    ts.value = undefined
    await nextTick()
    errors.value.splice(0)
    await nextTick()
    inputs.value.forEach((i) => {
      i.withState(false, i.key === 'title')
    })
  }

  const generate = useThrottleFn(async () => {
    if (generating.value)
      return

    generating.value = true
    await nextTick()
    errors.value.splice(0)
    await nextTick()
    try {
      const result = await Promise.all(inputs.value.filter((i) => {
        switch (i.key) {
          case 'title':
          case 'scope':
          case 'description':
          case 'themeColor':
          case 'maskedIcon':
          case 'framework':
          case 'strategy':
          case 'periodicUpdates':
          case 'behavior':
          case 'warn':
            return true
        }

        return false
      }).map((i) => {
        return i.validate()
      }))
      const validationResult = result.filter(r => r && r.length > 0).map(r => r[0])
      let customErrors: BuilderError[] | undefined
      if (showInjectRegister.value) {
        customErrors = await inputs.value.find(i => i.key === 'injectRegister')?.validate()
        if (customErrors && customErrors.length > 0)
          validationResult.push(customErrors[0])
      }

      if (showTS.value) {
        customErrors = await inputs.value.find(i => i.key === 'typescript')?.validate()
        if (customErrors && customErrors.length > 0)
          validationResult.push(customErrors[0])
      }

      if (validationResult && validationResult.length > 0) {
        errors.value.splice(0, errors.value.length, ...validationResult)
        await nextTick()
        validationResult[0].focus()
        return
      }

      // reset previous pwa result
      resetPWACode()
      const data: PWABuilderData = {
        title: title.value!,
        shortName: shortName.value,
        description: description.value!,
        themeColor: themeColor.value!,
        strategy: strategy.value!,
        behavior: behavior.value!,
        registerType: injectRegister.value!,
        framework: framework.value!,
        typescript: generateTypeScript.value,
        scope: scope.value!,
        startUrl: startUrl.value,
        addManifestMaskedIcon: maskedIcon.value === 'true',
        favicon: favicon.value!,
      }
      // prepare the result: enable entries for target fw
      const builder = await prepareBuilder(data)
      state.value = 'result'
      await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT))
      // generate pwa result
      await generatePWACode(builder, data)
    }
    finally {
      generating.value = false
    }
  }, 256, false, true)

  const back = async () => {
    state.value = 'initial'
    await nextTick()
    generating.value = false
  }

  onUnmounted(() => {
    inputs.value.splice(0)
  })

  return {
    state,
    title,
    description,
    shortName,
    themeColor,
    strategy,
    behavior,
    warnUser,
    injectRegister,
    framework,
    ts,
    scope,
    startUrl,
    maskedIcon,
    favicon,
    showInjectRegister,
    periodicUpdates,
    showTS,
    strategies,
    behaviors,
    warns,
    injectRegisters,
    frameworks,
    yesNoList,
    faviconList,
    generate,
    reset,
    generating,
    back,
  }
}

function createFrameworks() {
  return <RadioData<FrameworkType>[]>[{
    value: 'javascript',
    text: 'Vanilla JavaScript',
  }, {
    value: 'typescript',
    text: 'TypeScript',
  }, {
    value: 'vue',
    text: 'Vue 3',
  }, {
    value: 'react',
    text: 'React',
  }, {
    value: 'preact',
    text: 'Preact',
  }, {
    value: 'svelte',
    text: 'Svelte',
  }, {
    value: 'solid',
    text: 'Solid JS',
  }, {
    value: 'sveltekit',
    text: 'SvelteKit',
  }, {
    value: 'vitepress',
    text: 'VitePress',
  }, {
    value: 'iles',
    text: 'Îles',
  }, {
    value: 'astro',
    text: 'Astro (WIP: coming soon)',
    disabled: true,
  }]
}

function createStrategies() {
  return <RadioData<StrategyType>[]>[{
    value: 'generateSW',
    text: 'Generate the service worker for me',
  }, {
    value: 'injectManifest',
    text: 'I want to provide my own service worker',
  }]
}

function createBehaviors() {
  return <RadioData<BehaviorType>[]>[{
    value: 'autoUpdate',
    text: 'Just auto update my application',
  }, {
    value: 'prompt',
    text: 'I want to ask the user before update',
  }]
}

function createWarnReady() {
  return <RadioData<YesNoType>[]>[{
    value: 'true',
    text: 'Yes, I want to inform user',
  }, {
    value: 'false',
    text: 'No, just keep it as simple as possible',
  }]
}

function createYesNo() {
  return <RadioData<YesNoType>[]>[{
    value: 'true',
    text: 'Yes',
  }, {
    value: 'false',
    text: 'No',
  }]
}

function createInjectRegisters() {
  return <RadioData<InjectRegisterType>[]>[{
    value: 'inline',
    text: 'As simple as possible',
  }, {
    value: 'script',
    text: 'Generate registerSW.js script',
  }]
}

function createFavicons() {
  return <RadioData<FaviconType>[]>[{
    value: 'ico',
    text: 'Only favicon.ico',
  }, {
    value: 'svg',
    text: 'Only favicon.svg',
  }, {
    value: 'both',
    text: 'Both, favicon.ico and favicon.svg',
  }]
}

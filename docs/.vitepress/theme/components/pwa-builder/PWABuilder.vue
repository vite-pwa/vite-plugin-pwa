<script setup lang="ts">
import { ref } from 'vue'
import type { BuilderElement } from '../../composables/pwaBuilder'
import { usePWABuilder } from '../../composables/pwaBuilder'

const {
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
  showInjectRegister,
  showFrameworks,
  showTS,
  strategies,
  behaviors,
  warns,
  injectRegisters,
  frameworks,
  tss,
  generate,
  reset,
  generating,
} = usePWABuilder()

const titleRef = ref<BuilderElement | undefined>(undefined)
const vFocus = {
  mounted: (el: BuilderElement) => el.focus(),
}
</script>

<template>
  <div>
    <PBForm v-if="state === 'initial'" ref="form" @submit.prevent="generate">
      <template #inputs>
        <PBArticle id="application" title="Application">
          <PBInputText
            id="title"
            ref="titleRef"
            v-model="title"
            v-focus
            title="Title"
            error="Application Title / Name: required field."
          />
          <PBInputText
            id="description"
            v-model="description"
            title="Description"
            error="Application description: required field."
          />
          <PBInputText
            id="shortName"
            v-model="shortName"
            title="Short Name"
            error="Application Short Name: required field."
          />
          <PBInputColor
            id="themeColor"
            v-model="themeColor"
            title="Theme Color"
            error="Application Theme Color: required field."
          />
        </PBArticle>
        <PBArticle id="sw" title="Service Worker">
          <PBInputRadio
            id="strategy"
            v-model="strategy"
            :options="strategies"
            title="How do you want the Service Worker to be generated?"
            error="Service Worker Strategy: required field."
          />
          <PBInputRadio
            id="behavior"
            v-model="behavior"
            :options="behaviors"
            title="How do you want to update your app when new content available?"
            error="Service Worker Behavior: required field."
          />
          <PBInputRadio
            id="warn"
            v-model="warnUser"
            :options="warns"
            title="Do you want to warn the use when your app is ready to work offline?"
            error="Warn user when app is ready to work offline: required field."
          />
          <transition
            enter-active-class="animate-zoom-in animate-count-1 animate-duration-0.5s"
            leave-active-class="animate-zoom-out animate-count-1 animate-duration-0.5s"
          >
            <PBInputRadio
              v-if="showInjectRegister"
              id="injectRegister"
              v-model="injectRegister"
              :options="injectRegisters"
              title="How do you want to register the service worker?"
              error="Service Worker Registration: required field."
            />
          </transition>
        </PBArticle>
        <transition
          enter-active-class="animate-zoom-in animate-count-1 animate-duration-0.5s"
          leave-active-class="animate-zoom-out animate-count-1 animate-duration-0.5s"
        >
          <PBArticle
            v-if="showFrameworks"
            id="frameworks"
            title="Framework"
          >
            <PBInputRadio
              id="framework"
              v-model="framework"
              :options="frameworks"
              title="What framework are you using in your app?"
              error="Framework: required field."
            />
            <transition
              enter-active-class="animate-zoom-in animate-count-1 animate-duration-0.5s"
              leave-active-class="animate-zoom-out animate-count-1 animate-duration-0.5s"
            >
              <PBInputRadio
                v-if="showTS"
                id="typescript"
                v-model="ts"
                :options="tss"
                title="Are you using TypeScript in your app?"
                error="TypeScript: required field."
              />
            </transition>
          </PBArticle>
        </transition>
      </template>
      <template #buttons>
        <button :disabled="generating" type="submit">
          Generate
        </button>
        <button :disabled="generating" type="button" @click="reset(titleRef?.focus)">
          Reset
        </button>
      </template>
    </PBForm>
  </div>
</template>

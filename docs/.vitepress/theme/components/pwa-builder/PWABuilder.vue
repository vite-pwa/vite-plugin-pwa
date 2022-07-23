<script setup lang="ts">
import { ref } from 'vue'
import type { BuilderElement } from '../../types'
import { usePWABuilder } from '../../composables/pwaBuilder'
import PBButton from './PBButton.vue'
import PBResult from './PBResult.vue'

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
  periodicUpdates,
  framework,
  ts,
  scope,
  startUrl,
  maskedIcon,
  favicon,
  showInjectRegister,
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
} = usePWABuilder()

const titleRef = ref<BuilderElement | undefined>(undefined)
const vFocus = {
  mounted: (el: BuilderElement) => el.focus(),
}
</script>

<template>
  <div>
    <transition mode="out-in">
      <PBForm v-if="state === 'initial'" ref="form" @submit.prevent="generate">
        <template #inputs>
          <PBArticle id="application" title="Application x">
            <PBInputText
              id="title"
              ref="titleRef"
              v-model="title"
              v-focus
              title="Title"
              error="Application Title / Name: required field."
            />
            <PBInputText
              id="scope"
              v-model="scope"
              title="Base URL"
              error="Application Base URL: required field."
            />
            <PBInputText
              id="startUrl"
              v-model="startUrl"
              title="Start URL"
              error="dummy"
              placeholder="Will use Base URL if not specified"
              no-validate
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
              error="dummy"
              placeholder="Will use Title if not specified"
              no-validate
            />
            <PBInputColor
              id="themeColor"
              v-model="themeColor"
              title="Theme Color"
              error="Application Theme Color: required field."
            />
            <PBInputRadio
              id="maskedIcon"
              v-model="maskedIcon"
              :options="yesNoList"
              title="Add masked icon to the PWA manifest?"
              error="Masked Icon: required field."
            />
            <PBInputRadio
              id="favicon"
              v-model="favicon"
              :options="faviconList"
              title="Favicon Type"
              error="Favicon: required field."
            />
          </PBArticle>
          <PBArticle
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
              enter-active-class="pb-input-enter"
              leave-active-class="pb-input-leave"
            >
              <PBInputRadio
                v-if="showTS"
                id="typescript"
                v-model="ts"
                :options="yesNoList"
                title="Are you using TypeScript in your app?"
                error="TypeScript: required field."
              />
            </transition>
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
              id="periodicUpdates"
              v-model="periodicUpdates"
              :options="yesNoList"
              title="Do you want to check for periodic Service Worker updates?"
              error="Periodic Service Worker Updates: required field."
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
              enter-active-class="pb-input-enter"
              leave-active-class="pb-input-leave"
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
        </template>
        <template #buttons>
          <PBButton :disabled="generating" type="submit">
            Generate
          </PBButton>
          <PBButton :disabled="generating" type="button" theme="alt" @click="reset(titleRef?.focus)">
            Reset
          </PBButton>
        </template>
      </PBForm>
      <PBResult v-else>
        <div
          pt-6 mt-6
          border-t="~ base $vp-c-divider-light"
          grid="~ cols-[minmax(auto,9em)] lt-xs:cols-[1fr]"
        >
          <PBButton :disabled="generating" :theme="generating ? 'alt' : undefined" type="button" @click="back">
            Back
          </PBButton>
        </div>
      </PBResult>
    </transition>
  </div>
</template>

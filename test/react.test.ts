import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  type Effect = () => void | (() => void)

  const state: unknown[] = []
  const refs: Array<{ current: unknown }> = []
  const effects: Effect[] = []
  const updateServiceWorker = vi.fn(async () => {})
  const registerSW = vi.fn(() => updateServiceWorker)
  let stateIndex = 0
  let refIndex = 0

  function beginRender() {
    stateIndex = 0
    refIndex = 0
    effects.length = 0
  }

  return {
    registerSW,
    updateServiceWorker,
    reset() {
      state.length = 0
      refs.length = 0
      beginRender()
      registerSW.mockClear()
      updateServiceWorker.mockClear()
    },
    render<T>(callback: () => T) {
      beginRender()
      return callback()
    },
    runStrictEffects() {
      for (const effect of effects) {
        const cleanup = effect()
        if (typeof cleanup === 'function')
          cleanup()
        effect()
      }
    },
    useEffect(effect: Effect) {
      effects.push(effect)
    },
    useRef<T>(initialValue?: T) {
      const index = refIndex++
      if (!(index in refs))
        refs[index] = { current: initialValue }

      return refs[index] as { current: T | undefined }
    },
    useState<T>(initialState: T | (() => T)): [T, (value: T) => void] {
      const index = stateIndex++
      if (!(index in state)) {
        if (typeof initialState === 'function') {
          const initializer = initialState as () => T
          initializer()
          state[index] = initializer()
        }
        else {
          state[index] = initialState
        }
      }

      return [
        state[index] as T,
        (value: T) => {
          state[index] = value
        },
      ]
    },
  }
})

vi.mock('react', () => ({
  useEffect: mocks.useEffect,
  useRef: mocks.useRef,
  useState: mocks.useState,
}))

vi.mock('../src/client/build/register', () => ({
  registerSW: mocks.registerSW,
}))

const { useRegisterSW } = await import('../src/client/build/react')

describe('useRegisterSW for React', () => {
  beforeEach(() => {
    mocks.reset()
  })

  it('registers once after render when React StrictMode double-invokes hooks', async () => {
    const onRegistered = vi.fn()
    const result = mocks.render(() => useRegisterSW({ onRegistered }))

    expect(mocks.registerSW).not.toHaveBeenCalled()

    mocks.runStrictEffects()

    expect(mocks.registerSW).toHaveBeenCalledTimes(1)
    expect(mocks.registerSW).toHaveBeenCalledWith(expect.objectContaining({
      immediate: true,
      onRegistered,
    }))

    await result.updateServiceWorker(false)

    expect(mocks.updateServiceWorker).toHaveBeenCalledTimes(1)
    expect(mocks.updateServiceWorker).toHaveBeenCalledWith(false)
  })
})

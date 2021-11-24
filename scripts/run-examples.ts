import prompts from 'prompts'

import {
  yellow,
  green,
  cyan,
  blue,
  magenta,
  red,
} from 'kolorist'

type Color = (str: string | number) => string

type Behavior = {
  name: string
  display: string
  color: Color
}

type Strategy = {
  name: string
  display: string
  color: Color
  behaviors?: Behavior[]
}

type Framework = {
  name: string
  color: Color
  dir: string
  strategies: Strategy[]
}

const BEHAVIORS: Behavior[] = [
  {
    name: 'prompt',
    display: 'Prompt for update',
    color: green,
  },
  {
    name: 'claims',
    display: 'Auto update',
    color: blue,
  },
]

const STRATEGIES: Strategy[] = [
  {
    name: 'generateSW',
    display: 'generateSW',
    color: green,
    behaviors: BEHAVIORS,
  },
  {
    name: 'injectManifest',
    display: 'injectManifest',
    color: blue,
  },
]

const FRAMEWORKS: Framework[] = [
  {
    name: 'vue',
    color: green,
    dir: 'vue-router',
    strategies: STRATEGIES,
  },
  {
    name: 'react',
    color: cyan,
    dir: 'react-router',
    strategies: STRATEGIES,
  },
  {
    name: 'preact',
    color: magenta,
    dir: 'preact-router',
    strategies: STRATEGIES,
  },
  {
    name: 'svelte',
    color: red,
    dir: 'svelte-routify',
    strategies: STRATEGIES,
  },
  {
    name: 'solid',
    color: yellow,
    dir: 'solid-router',
    strategies: STRATEGIES,
  },
]

async function init() {
  try {
    const onCancel = () => {
      throw new Error(`${red('✖')} Operation cancelled`)
    }
    const { framework: useFramework } = await prompts(
      [
        {
          type: 'select',
          name: 'framework',
          message: 'Select a framework:',
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.name),
              value: framework,
            }
          }),
        },
      ],
      { onCancel },
    )
    const { strategy: useStrategy } = await prompts(
      [
        {
          type: 'select',
          name: 'strategy',
          message: 'Select a strategy:',
          initial: 0,
          choices: useFramework.strategies.map((strategy) => {
            const strategyColor = strategy.color
            return {
              title: strategyColor(strategy.name),
              value: strategy,
            }
          }),
        },
      ],
      { onCancel },
    )
    let useBehaviour: Behavior | undefined
    let useReloadSW: boolean | undefined
    if (useStrategy.behaviors) {
      const { behavior } = await prompts(
        [
          {
            type: 'select',
            name: 'behavior',
            message: 'Select a behavior:',
            initial: 0,
            choices: useStrategy.behaviors.map((behavior) => {
              const behaviorColor = behavior.color
              return {
                title: behaviorColor(behavior.display),
                value: behavior,
              }
            }),
          },
        ],
        { onCancel },
      )
      useBehaviour = behavior
      const { reloadSW } = await prompts(
        [
          {
            type: 'toggle',
            name: 'reloadSW',
            message: 'Enable periodic SW updates?',
            initial: false,
            active: 'yes',
            inactive: 'no',
          },
        ],
        { onCancel },
      )
      useReloadSW = reloadSW
    }
    // user choice associated with prompts
    // @ts-ignore
    console.log(useFramework.name)
    console.log(useStrategy.name)
    console.log(useBehaviour?.name)
    console.log(useReloadSW)
    let script = ''
    if (useStrategy === 'injectManifest') {
      script = '-sw'
    }
    else {
      switch (useBehaviour!.name) {
        case 'prompt':
          break
        case 'claims':
        default:
          script = '-claims'
          break
      }
      if (useReloadSW === true)
        script += '-reloadsw'
    }

    script = `pnpm -C examples/${useFramework.dir} run start${script}`
    console.log(script)
  }
  catch (cancelled) {
    // @ts-ignore
    console.log(cancelled.message)
  }
}

init().catch((e) => {
  console.error(e)
})

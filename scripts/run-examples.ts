import { execSync } from 'child_process'
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
  behaviors: Behavior[]
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
    behaviors: BEHAVIORS,
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
    name: 'sveltekit',
    color: blue,
    dir: 'sveltekit-pwa',
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
    const { framework } = await prompts(
      {
        type: 'select',
        name: 'framework',
        message: 'Select a framework:',
        initial: 0,
        choices: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color
          return {
            title: frameworkColor(framework.name),
            value: framework.name,
          }
        }),
      },
      { onCancel },
    )
    const useFramework = FRAMEWORKS.find(f => f.name === framework)!
    const { strategy } = await prompts(
      {
        type: 'select',
        name: 'strategy',
        message: 'Select a strategy:',
        initial: 0,
        choices: useFramework.strategies.map((strategy) => {
          const strategyColor = strategy.color
          return {
            title: strategyColor(strategy.name),
            value: strategy.name,
          }
        }),
      },
      { onCancel },
    )
    const useStrategy = STRATEGIES.find(e => e.name === strategy)!
    const { behavior } = await prompts(
      {
        type: 'select',
        name: 'behavior',
        message: 'Select a behavior:',
        initial: 0,
        choices: useStrategy.behaviors.map((behavior) => {
          const behaviorColor = behavior.color
          return {
            title: behaviorColor(behavior.display),
            value: behavior.name,
          }
        }),
      },
      { onCancel },
    )
    const useBehavior = BEHAVIORS.find(b => b.name === behavior)!
    const { reloadSW: useReloadSW }: { reloadSW: boolean } = await prompts(
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
    let script = ''
    if (useStrategy.name === 'injectManifest')
      script = '-sw'

    switch (useBehavior.name) {
      case 'prompt':
        break
      case 'claims':
      default:
        script += '-claims'
        break
    }

    if (useReloadSW)
      script += '-reloadsw'

    execSync(`pnpm run start${script}`, {
      stdio: 'inherit',
      cwd: `examples/${useFramework.dir}`,
    })
  }
  catch (cancelled) {
    // @ts-ignore
    console.log(cancelled.message)
  }
}

init().catch((e) => {
  console.error(e)
})

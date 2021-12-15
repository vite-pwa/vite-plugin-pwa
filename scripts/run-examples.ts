import { execSync } from 'child_process'
import prompts from 'prompts'
import {
  yellow,
  green,
  cyan,
  blue,
  magenta,
  red,
  reset,
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
}

type Framework = {
  name: string
  color: Color
  dir: string
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
  },
  {
    name: 'react',
    color: cyan,
    dir: 'react-router',
  },
  {
    name: 'preact',
    color: magenta,
    dir: 'preact-router',
  },
  {
    name: 'svelte',
    color: red,
    dir: 'svelte-routify',
  },
  {
    name: 'sveltekit',
    color: blue,
    dir: 'sveltekit-pwa',
  },
  {
    name: 'solid',
    color: yellow,
    dir: 'solid-router',
  },
]

type PromptResult = {
  framework: Framework
  strategy: Strategy
  behavior: Behavior
  reloadSW: boolean
}

async function init() {
  try {
    const { framework, strategy, behavior, reloadSW }: PromptResult = await prompts([
      {
        type: 'select',
        name: 'framework',
        message: reset('Select a framework:'),
        initial: 0,
        // @ts-ignore
        choices: FRAMEWORKS.map((framework) => {
          const frameworkColor = framework.color
          return {
            title: frameworkColor(framework.name),
            value: framework,
          }
        }),
      },
      {
        type: 'select',
        name: 'strategy',
        message: reset('Select a strategy:'),
        initial: 0,
        // @ts-ignore
        choices: STRATEGIES.map((strategy) => {
          const strategyColor = strategy.color
          return {
            title: strategyColor(strategy.name),
            value: strategy,
          }
        }),
      },
      {
        type: 'select',
        name: 'behavior',
        message: reset('Select a behavior:'),
        initial: 0,
        // @ts-ignore
        choices: BEHAVIORS.map((behavior) => {
          const behaviorColor = behavior.color
          return {
            title: behaviorColor(behavior.display),
            value: behavior,
          }
        }),
      },
      {
        type: 'toggle',
        name: 'reloadSW',
        message: reset('Enable periodic SW updates?'),
        initial: false,
        active: 'yes',
        inactive: 'no',
      },
    ],
    {
      onCancel: () => {
        throw new Error(`${red('✖')} Operation cancelled`)
      },
    })

    let script = ''
    if (strategy.name === 'injectManifest')
      script = '-sw'

    switch (behavior.name) {
      case 'prompt':
        break
      case 'claims':
      default:
        script += '-claims'
        break
    }

    if (reloadSW)
      script += '-reloadsw'

    execSync(`pnpm run start${script}`, {
      stdio: 'inherit',
      cwd: `examples/${framework.dir}`,
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

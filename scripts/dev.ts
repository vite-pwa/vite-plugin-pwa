import { spawn } from 'node:child_process'
import { commands } from './commands'

for (const command of commands)
  spawn('npx', [...command.split(' ').slice(1), '--watch', '--ignore-watch', 'dist'], { stdio: 'inherit' })

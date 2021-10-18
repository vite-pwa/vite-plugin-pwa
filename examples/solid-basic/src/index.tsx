/* eslint-disable react/react-in-jsx-scope */
import { render } from 'solid-js/web'

import App from './App'

render(
  () => (
    <App />
  ),
  document.getElementById('root') as HTMLElement,
)

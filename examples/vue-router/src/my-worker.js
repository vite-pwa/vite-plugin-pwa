import { mode, msg } from './workerImport'

let counter = 1

// eslint-disable-next-line no-restricted-globals
self.onmessage = (e) => {
  if (e.data === 'ping') {
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({ msg: `${msg} - ${counter++}`, mode })
  }
  else if (e.data === 'clear') {
    counter = 1
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({ msg: null, mode: null })
  }
}

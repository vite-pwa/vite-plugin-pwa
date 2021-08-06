# Svelte (WIP)

If you are using [Svelte Kit](https://kit.svelte.dev) <outbound-link /> you should use its 
[service worker module](https://kit.svelte.dev/docs#modules-$service-worker) <outbound-link />.

## Using Svelte

> Work in progress: once integrated on the plugin, `PWA Module Example` bellow will be removed from this entry, and the 
logic may change: this documentation page can also change.

You can use the built-in `Vite` virtual module `virtual:pwa-register/svelte` for `Svelte` which will return
`readable` stores (`Readable<boolean>`) for `offlineReady` and `needRefresh`.

In the meantime, just use the code provided on `PWA Module Example` bellow.

> You will need to add `workbox-window` as a `dev` dependency to your `Vite` project (we're fixing it).

### PWA Module Example

You can use this module (`src/pwa.ts`) to register and interact with the service worker:

<details>
  <summary><strong>src/pwa.ts</strong> code</summary>

```ts
import { Readable, writable } from 'svelte/store';
import { onMount } from 'svelte';
import { registerSW } from 'virtual:pwa-register';

export function useRegisterSW(
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void,
  onRegisterError?: (error: any) => void
): {
  offlineReady: Readable<boolean>
  needRefresh: Readable<boolean>
  updateSW: () => void
  close: () => void
} {
  let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined

  const offlineReady = writable(false)
  const needRefresh = writable(false)

  onMount(async() => {
    updateServiceWorker = registerSW({
      onOfflineReady() {
        offlineReady.set(true);
      },
      onNeedRefresh() {
        needRefresh.set(true);
      },
      onRegistered,
      onRegisterError
    })
  })

  function updateSW() {
    needRefresh.set(false);
    updateServiceWorker?.(true);
  }

  function close() {
    offlineReady.set(false);
    needRefresh.set(false);
  }

  return {
    offlineReady,
    needRefresh,
    updateSW,
    close
  }

}
```
</details>


### Prompt for update

You can use this code for your `components/ReloadPrompt.svelte` component:

<details>
  <summary><strong>components/ReloadPrompt.svelte</strong> code</summary>

```sveltehtml
<script lang="ts">
  // once integrated on the plugin, the import should be
  // import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { useRegisterSW } from '../pwa';

  const { offlineReady, needRefresh, updateSW, close } = useRegisterSW(
    (swr) => {
      console.log(`SW registered: ${swr}`);
    },
    (error) => {
      console.log('SW registration error', error);
    }
  );

  $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
  <div
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      {#if $offlineReady}
      <span>
        App ready to work offline
      </span>
      {:else}
      <span>
        New content available, click on reload button to update.
      </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button on:click={updateSW}>
        Reload
      </button>
    {/if}
    <button on:click={close}>
      Close
    </button>
  </div>
{/if}

<style>
    .pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border: 1px solid #8885;
        border-radius: 4px;
        z-index: 1;
        text-align: left;
        background-color: aqua;
        box-shadow: 3px 4px 5px 0 #8885;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
    .pwa-toast button {
        border: 1px solid #8885;
        outline: none;
        margin-right: 5px;
        border-radius: 2px;
        padding: 3px 10px;
    }
</style>
```
</details>

### Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates.html), you can use this code to configure this
behavior on your application with the virtual module `virtual:pwa-register/svelte`:

```ts
// once integrated on the plugin, the import should be
// import { useRegisterSW } from 'virtual:pwa-register/svelte';
import { useRegisterSW } from '../pwa';

const intervalMS = 60 * 60 * 1000

const updateServiceWorker = useRegisterSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
    }, intervalMS)
  }
})
```

The interval must be in milliseconds, in the example above it is configured to check the service worker every hour.

> Since `workbox-window` uses a time-based `heuristic` algorithm to handle service worker updates, if you
build your service worker and register it again, if the time between last registration and the new one is less than
1 minute, then, `workbox-window` will handle the `service worker update found` event as an external event, and so the
behavior could be strange (for example, if using `prompt`, instead showing the dialog for new content available, the
ready  to work offline dialog will be shown; if using `autoUpdate`, the ready to work offline dialog will be shown and
shouldn't be shown).

### SW Registration Errors

As explained in [SW Registration Errors](/guide/sw-registration-errors.html), you can notify the user with
following code:

```ts
// once integrated on the plugin, the import should be
// import { useRegisterSW } from 'virtual:pwa-register/svelte';
import { useRegisterSW } from '../pwa';

const updateServiceWorker = useRegisterSW({
  onRegiterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker.


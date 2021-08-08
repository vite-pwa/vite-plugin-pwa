# Svelte

If you are using [Svelte Kit](https://kit.svelte.dev) <outbound-link /> you should use its 
[service worker module](https://kit.svelte.dev/docs#modules-$service-worker) <outbound-link />.

You can use the built-in `Vite` virtual module `virtual:pwa-register/svelte` for `Svelte` which will return
`writable` stores (`Writable<boolean>`) for `offlineReady` and `needRefresh`.

> You will need to add `workbox-window` as a `dev` dependency to your `Vite` project.

## Prompt for update

You can use this `ReloadPrompt.svelte` component:

<details>
  <summary><strong>components/ReloadPrompt.svelte</strong> code</summary>

```html
<script lang="ts">
  import { useRegisterSW } from 'virtual:pwa-register/svelte';

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(swr) {
      console.log(`SW registered: ${swr}`);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });

  function close() {
    offlineReady.set(false)
    needRefresh.set(false)
  }

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
      <button on:click={() => updateServiceWorker(true))}>
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

## Periodic SW Updates

As explained in [Periodic Service Worker Updates](/guide/periodic-sw-updates.html), you can use this code to configure this
behavior on your application with the virtual module `virtual:pwa-register/svelte`:

```ts
import { useRegisterSW } from 'virtual:pwa-register/svelte';

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

## SW Registration Errors

As explained in [SW Registration Errors](/guide/sw-registration-errors.html), you can notify the user with
following code:

```ts
import { useRegisterSW } from 'virtual:pwa-register/svelte';

const updateServiceWorker = useRegisterSW({
  onRegiterError(error) {}
})
```

and then inside `onRegisterError`, just notify the user that there was an error registering the service worker.


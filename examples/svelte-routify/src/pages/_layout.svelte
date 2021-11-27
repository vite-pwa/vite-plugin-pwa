<script lang="ts">
    // replaced dyanmicaly
    const date = '__DATE__'
</script>

<main>
  <img src="/favicon.svg" alt="PWA Logo" width="60" height="60"/>
  <h1>Svelte PWA!</h1>

  <div class="built">Built at: { date }</div>

  <slot />

</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }

    }


</style>

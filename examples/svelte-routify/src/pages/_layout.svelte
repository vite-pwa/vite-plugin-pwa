<script lang="ts">
  // https://github.com/sveltejs/kit/issues/587
  import logo from '../assets/svelte.png'
</script>

<main>
  <img src={logo} alt="Svelte Logo" width="128" height="128"/>
  <h1>Hi Svelte PWA!</h1>

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

    img {
        height: 128px;
        width: 128px;
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

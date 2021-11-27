<script lang="ts">
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import ReloadPrompt from './lib/ReloadPrompt.svelte'
</script>

<Router {routes} />

<ReloadPrompt />


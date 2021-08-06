<script lang="ts">
  import { url, params } from '@roxi/routify'

  // replaced dyanmicaly
  const date = '__DATE__'

  $: name = $params.name
</script>

<div><strong>/hi</strong> route, built at: { date }</div>

<p>
  Hi: { name }
</p>
<br>
<a href={$url('../')}>Go Home</a>

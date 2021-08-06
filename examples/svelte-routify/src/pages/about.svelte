<script lang="ts">
  import { url } from '@roxi/routify'

  // replaced dyanmicaly
  const date = '__DATE__'
</script>

<div><strong>/about</strong> route, built at: { date }</div>
<br>
<a href={$url('./')}>Go Home</a>

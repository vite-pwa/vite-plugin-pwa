<script lang="ts">
	import { page } from '$app/stores'

	// replaced dynamicaly
	const date = '__DATE__'

	$: name = decodeURIComponent($page.params.name || '')
</script>

<div><strong>/hi</strong> route, built at: { date }</div>

<p>
	Hi: { name }
</p>
<br>
<a href="/">Go Home</a>

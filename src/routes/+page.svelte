<script lang="ts">
	import type { PageData } from './$types';
	import ListTask from '$lib/ListTask.svelte';

	export let data: PageData;
</script>

<h1>Todo List</h1>
<div>
	<h2>Public Lists</h2>
	<div class="p-2">
		<ListTask tasks={data.public} />
	</div>
</div>
<div>
	{#if data.private.length != 0}
		<h2>Your List</h2>
		<div class="p-2">
			<ListTask tasks={data.private} />
		</div>
	{/if}
	{#if data.private.length == 0}
		<h2>You need to login to see your Todo List</h2>
	{/if}
</div>

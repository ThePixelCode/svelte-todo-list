<script lang="ts">
	import type { PageData } from './$types';
	import ListTask from '$lib/ListTask.svelte';
	import { onDestroy } from 'svelte';
	import type { Task } from '$lib/types';

	export let data: PageData;
	let publicTask: Task[];
	let privateTask: Task[];
	const unsubscribe = data.tasks.subscribe((taskLists) => {
		publicTask = taskLists.filter((task) => task.userId == null);
		privateTask = taskLists.filter((task) => task.userId != null);
	});

	onDestroy(unsubscribe);
</script>

<h1>Todo List</h1>
<div>
	<h2>Public Lists</h2>
	<div class="p-2 grid grid-flow-row gap-4">
		<ListTask tasks={publicTask} />
	</div>
</div>
<div>
	{#if privateTask.length != 0}
		<h2>Your List</h2>
		<div class="p-2 grid grid-flow-row gap-4">
			<ListTask tasks={privateTask} />
		</div>
	{/if}
	{#if privateTask.length == 0}
		<h2>You need to login to see your Todo List</h2>
	{/if}
</div>

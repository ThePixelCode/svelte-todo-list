<script lang="ts">
	import type { Task } from './types';
	import EditTask from './EditTask.svelte';

	export let tasks: Task[];
</script>

{#each tasks as task}
	<div class="grid grid-cols-5 min-h-[3rem]">
		<div class="col-span-4">
			{`Task: ${task.title}, created at: ${new Date(task.createdAt).toLocaleString()}`}
		</div>
		<EditTask {task} />
	</div>
{/each}

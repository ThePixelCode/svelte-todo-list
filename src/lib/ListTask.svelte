<script lang="ts">
	import type { Task } from './types';
	import EditTask from './EditTask.svelte';
	import NewTask from './NewTask.svelte';

	export let tasks: Task[];
</script>

{#each tasks as task}
	<div class="grid grid-cols-5 min-h-[3rem]">
		<div class="col-span-4 grid grid-flow-row">
			<div>{`Task: ${task.title}, created at: ${new Date(task.createdAt).toLocaleString()}`}</div>
			<div>
				{`Completed: ${task.completed ? 'yes' : 'no'}, Deathline: ${
					task.deathline ? new Date(task.deathline).toLocaleString() : 'no'
				}`}
			</div>
		</div>
		<EditTask id={task.id} />
	</div>
{/each}
<NewTask />

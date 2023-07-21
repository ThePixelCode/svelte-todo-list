<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Task } from './types';
	import { taskList } from './store';

	export let id: number;

	let title: string;
	let deathline: string | null;
	let completed: boolean;

	let visible = false;

	function toggleModal() {
		visible = !visible;
	}

	function updateTaskData(newTask: Task) {
		taskList.update((tasks) => {
			tasks[tasks.findIndex((task) => task.id == id)] = newTask;
			return tasks;
		});
	}

	async function handleForm(_: SubmitEvent) {
		let newTask = {
			id,
			title,
			deathline: deathline ? (deathline == '' ? null : deathline + 'Z') : null,
			completed
		};
		let response = await fetch('/api/v1/task', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTask)
		});
		if (response.ok) {
			let data: Task = await response.json();
			updateTaskData(data);
		} else {
			console.error(`Something went realy wrong, status: ${response.status}`);
		}
	}
	const unsubscribe = taskList.subscribe((tasks) => {
		const task = tasks.find((task) => task.id == id);
		if (task == undefined) {
			console.error('something went REALLY WRONG');
			return;
		}
		title = task.title;
		deathline = task.deathline ? new Date(task.deathline).toISOString().replace('Z', '') : null;
		completed = task.completed;
	});
	onDestroy(unsubscribe);
</script>

<button
	on:click={toggleModal}
	class="bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 transition-colors duration-300 ease-in-out"
	>edit #{id}</button
>

<div
	class={`${
		visible ? 'visible' : 'invisible'
	} absolute bg-black/80 w-screen h-screen bottom-0 top-0 left-0 right-0 grid place-content-center`}
>
	<div class="bg-white text-black w-[50vw] h-[50vh] relative">
		<button on:click={toggleModal} class="absolute right-4 top-4">X</button>
		<form on:submit|preventDefault={handleForm} class="m-10 relative">
			<label for={`task-${id}-title`}>Title:</label>
			<input
				type="text"
				name={`task-${id}-title`}
				id={`task-${id}-title`}
				bind:value={title}
				class="form-input mb-4 w-full border-0 border-b-2 border-neutral-400 focus:border-black focus:ring-0"
			/>
			<label for={`task-${id}-deathline`}>Deathline:</label>
			<input
				type="datetime-local"
				name={`task-${id}-deathline`}
				id={`task-${id}-deathline`}
				class="form-input mb-4 w-full border-0 border-b-2 border-neutral-400 focus:border-black focus:ring-0"
				bind:value={deathline}
			/>
			<label for={`task-${id}-completed`}>Completed:</label>
			<input
				type="checkbox"
				name={`task-${id}-completed`}
				id={`task-${id}-completed`}
				class="form-input w-4 h-4 rounded inline-block border-b-2 border-neutral-400 focus:border-black focus:ring-0"
				bind:checked={completed}
			/>
			<input type="submit" value="Submit" class="absolute bottom-0 right-0" />
		</form>
	</div>
</div>

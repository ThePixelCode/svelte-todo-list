<script lang="ts">
	import { taskList } from './store';
	import type { Task } from './types';

	let visible = false;

	let title: string = '';
	let deathline: string | null = null;

	function toggleModal() {
		visible = !visible;
	}

	async function handleForm(_: SubmitEvent) {
		const newTask = {
			title,
			deathline: deathline ? (deathline == '' ? null : deathline + 'Z') : null
		};
		const response = await fetch('/api/v1/task', {
			method: 'POST',
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

	function updateTaskData(newTask: Task) {
		taskList.update((tasks) => tasks.concat(newTask));
	}
</script>

<div class="grid grid-cols-3 min-h-[3rem]">
	<p class="">Create new Task</p>
	<button
		class="col-span-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 transition-colors duration-300 ease-in-out"
		on:click={toggleModal}>+</button
	>
	<div
		class={`${
			visible ? 'visible' : 'invisible'
		} absolute bg-black/80 w-screen h-screen bottom-0 top-0 left-0 right-0 grid place-content-center`}
	>
		<div class="bg-white text-black w-[50vw] h-[50vh] relative">
			<button on:click={toggleModal} class="absolute right-4 top-4">X</button>
			<form on:submit|preventDefault={handleForm} class="m-10 relative">
				<label for={`task-new-title`}>Title:</label>
				<input
					type="text"
					name={`task-new-title`}
					id={`task-new-title`}
					bind:value={title}
					class="form-input mb-4 w-full border-0 border-b-2 border-neutral-400 focus:border-black focus:ring-0"
				/>
				<label for={`task-new-deathline`}>Deathline:</label>
				<input
					type="datetime-local"
					name={`task-new-deathline`}
					id={`task-new-deathline`}
					class="form-input mb-8 w-full border-0 border-b-2 border-neutral-400 focus:border-black focus:ring-0"
					bind:value={deathline}
				/>
				<input type="submit" value="Submit" class="absolute bottom-0 right-0" />
			</form>
		</div>
	</div>
</div>

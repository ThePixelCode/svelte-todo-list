<script lang="ts">
	import type { Task } from './types';

	export let task: Task;

	let title = task.title;
	let deathline = task.deathline ? task.deathline.replace('Z', '') : undefined;
	let completed = task.completed;

	let visible = false;

	function toggleModal() {
		visible = !visible;
	}

	async function handleForm(event: SubmitEvent) {
		// TODO
		let newTask = { id: task.id, title, deathline, completed };
		let response = await fetch('/api/v1/task', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newTask)
		});
		if (response.ok) {
			let data = await response.json();
			console.log(data);
		} else {
			console.error(`Something went realy wrong, status: ${response.status}`);
		}
	}
</script>

<button on:click={toggleModal}>edit #{task.id}</button>

<div
	class={`${
		visible ? 'visible' : 'invisible'
	} absolute bg-black/80 w-screen h-screen bottom-0 top-0 left-0 right-0 grid place-content-center`}
>
	<div class="bg-white text-black w-[50vw] h-[50vh] relative">
		<button on:click={toggleModal} class="absolute right-4 top-4">X</button>
		<form on:submit|preventDefault={handleForm} class="m-5">
			<label for={`task-${task.id}-title`}>Title:</label>
			<input
				type="text"
				name={`task-${task.id}-title`}
				id={`task-${task.id}-title`}
				bind:value={title}
			/>
			<label for={`task-${task.id}-deathline`}>Deathline:</label>
			<input
				type="datetime-local"
				name={`task-${task.id}-deathline`}
				id={`task-${task.id}-deathline`}
				bind:value={deathline}
			/>
			<label for={`task-${task.id}-completed`}>Completed:</label>
			<input
				type="checkbox"
				name={`task-${task.id}-completed`}
				id={`task-${task.id}-completed`}
				bind:checked={completed}
			/>
			<label for="submit">Submit</label>
			<input type="submit" value="submit" />
		</form>
	</div>
</div>

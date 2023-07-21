import { taskList } from '$lib/store';
import type { Task } from '$lib/types';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const request = await fetch('/api/v1/task', {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});
	const data: Task[] = await request.json();
	taskList.set(data);
	return {
		tasks: taskList
	};
}) satisfies PageLoad;

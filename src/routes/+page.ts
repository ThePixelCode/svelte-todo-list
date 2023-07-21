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
	const publicTasks = data.filter((task) => task.userId == null);
	const privateTasks = data.filter((task) => task.userId != null);
	return {
		public: publicTasks,
		private: privateTasks
	};
}) satisfies PageLoad;

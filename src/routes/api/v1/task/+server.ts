import { prisma } from '$lib/server/prisma';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const pageSize = 10;

export const GET = (async ({ url }) => {
	const idString = url.searchParams.get('id');
	const pageUncheckedNumber = Number(url.searchParams.get('page') ?? '1');
	if (isNaN(pageUncheckedNumber)) return json({ error: 'invalid page' }, { status: 400 });
	const page = Math.floor(pageUncheckedNumber);
	const id = idString != null ? Number(idString) : idString;
	if (id != null && isNaN(id)) return json({ error: 'invalid id' }, { status: 400 });
	const result = await prisma.task.findMany({
		where: {
			id: id != null ? id : undefined
		},
		skip: (page - 1) * pageSize,
		take: pageSize
	});
	return json(result, { status: 200 });
}) satisfies RequestHandler;

export const POST = (() => {
	// TODO: Implement logic
	throw error(418, 'Not yet implemented');
}) satisfies RequestHandler;

export const PUT = (() => {
	// TODO: Implement logic
	throw error(418, 'Not yet implemented');
}) satisfies RequestHandler;

export const PATCH = (() => {
	// TODO: Implement logic
	throw error(418, 'Not yet implemented');
}) satisfies RequestHandler;

export const DELETE = (() => {
	// TODO: Implement logic
	throw error(418, 'Not yet implemented');
}) satisfies RequestHandler;

import { prisma } from '$lib/server/prisma';
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError
} from '@prisma/client/runtime/library';
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

export const POST = (async ({ request }) => {
	try {
		const newTask: { title: string; deathline: string | null } = await request.json();
		const result = await prisma.task.create({
			data: {
				title: newTask.title,
				deathline: newTask.deathline,
				userId: null
			}
		});
		return json(result, { status: 201 });
	} catch (e) {
		if ((e as SyntaxError).name == 'SyntaxError')
			return json({ error: 'invalid request body' }, { status: 400 });
		if (e instanceof PrismaClientValidationError)
			return json({ error: 'invalid request body' }, { status: 400 });
		throw error(500, 'internal server error');
	}
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	try {
		const update: { id: number; title: string; deathline: string | null; completed: boolean } =
			await request.json();
		if (
			update.id == undefined ||
			update.title == undefined ||
			update.deathline === undefined ||
			update.completed == undefined
		)
			throw new SyntaxError('invalid object');
		const result = await prisma.task.update({
			where: {
				id: update.id
			},
			data: {
				title: update.title,
				deathline: update.deathline,
				completed: update.completed
			}
		});
		return json(result, { status: 200 });
	} catch (e) {
		console.log(e);
		if ((e as SyntaxError).name == 'SyntaxError')
			return json({ error: 'invalid request body' }, { status: 400 });
		if (e instanceof PrismaClientValidationError)
			return json({ error: 'invalid request body' }, { status: 400 });
		if ((e as PrismaClientKnownRequestError).code == 'P2025')
			return json({ error: 'task not found' }, { status: 400 });
		throw error(500, 'internal server error');
	}
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
	try {
		const update: { id: number; title?: string; deathline?: string | null; completed?: boolean } =
			await request.json();
		const result = await prisma.task.update({
			where: {
				id: update.id
			},
			data: {
				title: update.title,
				deathline: update.deathline,
				completed: update.completed
			}
		});
		return json(result, { status: 200 });
	} catch (e) {
		if ((e as SyntaxError).name == 'SyntaxError')
			return json({ error: 'invalid request body' }, { status: 400 });
		if (e instanceof PrismaClientValidationError)
			return json({ error: 'invalid request body' }, { status: 400 });
		if ((e as PrismaClientKnownRequestError).code == 'P2025')
			return json({ error: 'task not found' }, { status: 400 });
		throw error(500, 'internal server error');
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	try {
		const idString = url.searchParams.get('id');
		if (idString == null) return json({ error: 'id not set' }, { status: 400 });
		let id = Number(idString);
		if (isNaN(id) || id < 1) return json({ error: 'invalid id' }, { status: 400 });
		id = Math.floor(id);
		const result = await prisma.task.delete({
			where: {
				id: id
			}
		});
		return json(result, { status: 200 });
	} catch (e) {
		if ((e as PrismaClientKnownRequestError).code == 'P2025')
			return json({ error: 'task not found' }, { status: 400 });
		throw error(500, 'internal server error');
	}
}) satisfies RequestHandler;

import { prisma } from '$lib/server/prisma';
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError
} from '@prisma/client/runtime/library';
import { error, json, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcryptjs';

export const actions = {
	login: async ({ request, cookies, url }) => {
		try {
			// Validate
			const data: { username: string; password: string } = await request.json();
			if (data.username == undefined || data.password == undefined) {
				return json({ message: 'username or password is undefined' }, { status: 400 });
			}
			if (data.username == '' || data.password == '') {
				return json({ message: 'username or password is empty' }, { status: 400 });
			}
			// Retrive Data
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					username: data.username
				}
			});
			// Authenticate
			if (!bcrypt.compareSync(data.password, user.password)) {
				return json({ message: 'username or password is incorrect' }, { status: 400 });
			}
			// Create Session
			const session = await prisma.session.create({
				data: {
					userId: user.id,
					token: bcrypt.hashSync(user.username + user.password, 10)
				}
			});
			cookies.set('session', session.token, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
				sameSite: 'lax'
			});
			// Redirect
			return redirect(300, url.searchParams.get('redirect') ?? '/');
		} catch (e: unknown) {
			console.log(e);
			if ((e as SyntaxError).name == 'SyntaxError')
				return json({ error: 'invalid request body' }, { status: 400 });
			if (e instanceof PrismaClientValidationError)
				return json({ error: 'invalid request body' }, { status: 400 });
			if ((e as PrismaClientKnownRequestError).code == 'P2025')
				return json({ error: 'task not found' }, { status: 400 });
			throw error(500, 'internal server error');
		}
	},
	register: async ({ request, cookies, url }) => {
		try {
			// TODO
			// Validate
			const data: { username: string; password: string } = await request.json();
			if (data.username == undefined || data.password == undefined) {
				return json({ message: 'username or password is undefined' }, { status: 400 });
			}
			if (data.username == '' || data.password == '') {
				return json({ message: 'username or password is empty' }, { status: 400 });
			}
			// Create
			const user = await prisma.user.create({
				data: {
					username: data.username,
					password: bcrypt.hashSync(data.password, 10)
				}
			});
			// Create Session
			const session = await prisma.session.create({
				data: {
					userId: user.id,
					token: bcrypt.hashSync(user.username + user.password, 10)
				}
			});
			cookies.set('session', session.token, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
				sameSite: 'lax'
			});
			// Redirect
			return redirect(300, url.searchParams.get('redirect') ?? '/');
		} catch (e: unknown) {
			console.log(e);
			if ((e as SyntaxError).name == 'SyntaxError')
				return json({ error: 'invalid request body' }, { status: 400 });
			if (e instanceof PrismaClientValidationError)
				return json({ error: 'invalid request body' }, { status: 400 });
			if ((e as PrismaClientKnownRequestError).code == 'P2025')
				return json({ error: 'task not found' }, { status: 400 });
			throw error(500, 'internal server error');
		}
	}
} satisfies Actions;

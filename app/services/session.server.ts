import { createCookieSessionStorage } from '@remix-run/node'
import * as bcrypt from 'bcrypt'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'
import { CRYPT_SALT } from './constants.server'
import { db } from './database.server'

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__shoppr_session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: ['s3cret'],
		secure: true
	}
})

export const { getSession, commitSession, destroySession } = sessionStorage
export const auth = new Authenticator<string>(sessionStorage)

auth.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get('email') as string
		const rawPassword = form.get('password') as string
		const password = await bcrypt.hash(rawPassword, CRYPT_SALT)
		invariant(email, 'Email is required')
		invariant(rawPassword, 'Password is required')

		const user = await db.accounts.findOne({ email })

		if (!user) {
			throw new AuthorizationError('Invalid email')
		}

		if (user.password !== password) {
			throw new AuthorizationError('Invalid password')
		}

		return email
	}),
	'user-pass'
)

// reexport hash from bcrypt
export const { hash } = bcrypt

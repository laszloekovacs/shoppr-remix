import { createCookieSessionStorage } from '@remix-run/node'
import { hash } from 'bcrypt'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { CRYPT_SALT } from './constants.server'
import { db } from './database.server'
import invariant from 'tiny-invariant'

type SessionData = {
	cart: string[]
}

type SessionFlashData = {
	error: string
}

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__shoppr_session',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7, // 1 week
		path: '/',
		sameSite: 'lax',
		secrets: ['supersecretsecret'],
		secure: true
	}
})

export const authenticator = new Authenticator(sessionStorage)

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get('email') as string
		const rawPassword = form.get('password') as string
		const password = await hash(rawPassword, CRYPT_SALT)
		invariant(email, 'Email is required')
		invariant(rawPassword, 'Password is required')

		const user = await db.accounts.findOne({ email })

		if (!user) {
			throw new AuthorizationError('Invalid email')
		}

		if (user.password !== password) {
			throw new AuthorizationError('Invalid password')
		}

		// make sure you dont return the password
		return { id: user._id, email: user.email }
	}),
	'user-pass'
)

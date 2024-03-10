import { createCookieSessionStorage } from '@remix-run/node'
import { hash } from 'bcrypt'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { CRYPT_SALT } from './constants.server'
import { db } from './database.server'

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
		const intent = form.get('intent') as 'register' | null

		const password = await hash(rawPassword, CRYPT_SALT)
		console.log(`intent: ${intent}, email: ${email}`)

		if (intent == 'register') {
			// check if we already have a user with the same email
			const user = await db.accounts.findOne({ email })
			if (user) {
				return { error: 'User already exists' }
			}

			// create the user
			const result = await db.accounts.insertOne({ email, password })
			if (!result.acknowledged) {
				return { error: 'Failed to create user' }
			}
		}

		// login. return the user / null if he doesn't exist
		const user = await db.accounts.findOne({ email, password })
		return user
	}),
	'user-pass'
)

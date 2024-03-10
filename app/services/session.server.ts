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

		console.log('logging in ', email)

		//const salt = await genSalt(10)
		//console.log(salt)

		const password = await hash(rawPassword, CRYPT_SALT)

		// find account
		const user = await db.accounts.findOne({ email, password })

		// return user
		return user
	}),
	'user-pass'
)

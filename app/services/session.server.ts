import { createCookieSessionStorage, json } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { genSalt, hash } from 'bcrypt'
import { CRYPT_SALT } from './constants.server'
import invariant from 'tiny-invariant'
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
		const password = form.get('password') as string
		invariant(email, 'Email is required')
		invariant(password, 'Password is required')

		console.log('logging in ', email)

		//const salt = await genSalt(10)
		//console.log(salt)

		const passwordHash = await hash(password, CRYPT_SALT)

		// find account
		const user = await db.accounts.findOne({ email, password: passwordHash })

		// return user
		return json({ user })
	}),
	'user-pass'
)

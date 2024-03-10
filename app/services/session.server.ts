import { createCookieSessionStorage } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'

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
		const email = form.get('email')
		const password = form.get('password')

		// todo, hash password, get the user from db, register user
		// login etc
		//const user = await findOrCreateUser(email, password)
		// return user
		return { id: 1 }
	}),
	'user-pass'
)

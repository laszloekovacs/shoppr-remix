import { createCookieSessionStorage } from '@remix-run/node'
import * as bcrypt from 'bcrypt'
import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { CRYPT_SALT } from './constants.server'
import { db } from './database.server'
import { WithId } from 'mongodb'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__shoppr_session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: ['s3cret'],
		secure: true
	}
})

export type AuthError = {
	error: string
	message: string
}

// define a new authenticator
export const auth = new Authenticator<User | AuthError>(sessionStorage)

// ... with a form strategy. This will not throw any errors, redirect options wont be used
// when authenticate is called
const formStrategy = new FormStrategy<User | AuthError>(async ({ form }) => {
	const email = form.get('email') as string
	const rawPassword = form.get('password') as string
	const password = await bcrypt.hash(rawPassword, CRYPT_SALT)

	const user = await db.accounts.findOne<WithId<Account>>({ email })

	if (!user) {
		return { message: 'Invalid email', error: 'email' }
	}

	if (user.password !== password) {
		return { message: 'Invalid password', error: 'password' }
	}

	return { email: user.email }
})

auth.use(formStrategy, 'user-pass')

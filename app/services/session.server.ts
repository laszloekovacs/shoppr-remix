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

export class AuthenticationError extends Error {
	constructor(public message: string, public error: string) {
		super(message)
	}
}

export const auth = new Authenticator<User | AuthenticationError>(
	sessionStorage
)

const formStrategy = new FormStrategy<User | AuthenticationError>(
	async ({ form }) => {
		const email = form.get('email') as string
		const rawPassword = form.get('password') as string
		const password = await bcrypt.hash(rawPassword, CRYPT_SALT)

		const user = await db.accounts.findOne<WithId<Account>>({ email })

		if (!user) {
			throw new AuthenticationError('Invalid email', 'email')
		}

		if (user.password !== password) {
			throw new AuthenticationError('Invalid password', 'password')
		}

		return { email: user.email }
	}
)

auth.use(formStrategy, 'user-pass')

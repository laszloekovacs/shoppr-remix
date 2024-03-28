import { createCookieSessionStorage } from '@remix-run/node'
import * as bcrypt from 'bcrypt'
import { Authenticator, AuthorizationError } from 'remix-auth'
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

export const auth = new Authenticator<User>(sessionStorage)

const formStrategy = new FormStrategy<User>(async ({ form }) => {
	const email = form.get('email') as string
	const rawPassword = form.get('password') as string
	const password = await bcrypt.hash(rawPassword, CRYPT_SALT)

	const user = await db.accounts.findOne<WithId<Account>>({ email })

	if (!user) {
		throw new AuthorizationError('email')
	}

	if (user.password !== password) {
		throw new AuthorizationError('password')
	}

	return { email: user.email }
})

auth.use(formStrategy, 'user-pass')

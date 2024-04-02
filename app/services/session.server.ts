import { createCookieSessionStorage } from '@remix-run/node'
import * as bcrypt from 'bcrypt'
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { db } from './database.server'
import { WithId } from 'mongodb'
import { Auth0Strategy } from 'remix-auth-auth0'
import {
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	AUTH0_DOMAIN,
	CRYPT_SALT
} from './constants.server'

const CALLBACK_URL = '/auth0/callback'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__shoppr_session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: ['s3cret'],
		secure: true,
		maxAge: 60 * 60 * 24 // 1 day
	}
})

export const auth = new Authenticator<User>(sessionStorage)

//
// Form Strategy
//
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

//
// Auth0 Strategy
//
const auth0Strategy = new Auth0Strategy<User>(
	{
		callbackURL: CALLBACK_URL,
		domain: AUTH0_DOMAIN,
		clientID: AUTH0_CLIENT_ID,
		clientSecret: AUTH0_CLIENT_SECRET
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		if (!profile || !profile.emails || !profile.emails[0]) {
			throw new AuthorizationError('auth0')
		}

		const user = await db.accounts.findOne<WithId<Account>>({
			email: profile.emails[0].value
		})

		if (!user) {
			throw new AuthorizationError('auth0')
		}

		return { email: user.email }
	}
)

// auth.use(auth0Strategy, 'auth0')

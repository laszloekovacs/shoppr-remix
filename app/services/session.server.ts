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
const CALLBACK_URL = '/api/auth0/callback'

const auth0Strategy = new Auth0Strategy<User>(
	{
		callbackURL: CALLBACK_URL,
		domain: AUTH0_DOMAIN,
		clientID: AUTH0_CLIENT_ID,
		clientSecret: AUTH0_CLIENT_SECRET
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		if (!profile || !profile.emails || !profile.emails[0]) {
			throw new AuthorizationError('no profile or email found')
		}

		const user = await db.accounts.findOne<WithId<Account>>({
			email: profile.emails[0].value
		})

		if (user) {
			return { email: user.email }
		}

		// could not find user, create one
		const result = await db.accounts.insertOne({
			email: profile.emails[0].value,
			photo:
				profile.photos && profile.photos[0] ? profile.photos[0].value : null
		})

		if (!result.acknowledged) {
			throw new AuthorizationError('could not create user')
		}

		return { email: profile.emails[0].value }
	}
)

auth.use(auth0Strategy, 'auth0')

import { createCookieSessionStorage } from '@remix-run/node'

type SessionData = {
	cart: string[]
}

type SessionFlashData = {
	error: string
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<
	SessionData,
	SessionFlashData
>({
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

export { getSession, commitSession, destroySession }

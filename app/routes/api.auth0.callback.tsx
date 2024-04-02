import type { LoaderFunctionArgs } from '@remix-run/node'
import { auth } from '../services/session.server'

export const loader = ({ request }: LoaderFunctionArgs) => {
	return auth.authenticate('auth0', request, {
		successRedirect: '/',
		failureRedirect: '/login'
	})
}

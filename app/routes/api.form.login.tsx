import { ActionFunctionArgs, json } from '@remix-run/node'
import { AuthorizationError } from 'remix-auth'
import { auth } from '~/services/index.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		await auth.authenticate('user-pass', request, {
			successRedirect: '/',
			throwOnError: true
		})
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return json({ error: error.message }, { status: 401 })
		}
		throw error
	}
}

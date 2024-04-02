import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { auth } from '~/services/index.server'

export const loader = () => redirect('/login')

export const action = ({ request }: ActionFunctionArgs) => {
	return auth.authenticate('auth0', request)
}

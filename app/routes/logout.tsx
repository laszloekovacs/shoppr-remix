import { LoaderFunctionArgs } from '@remix-run/node'
import { auth } from '~/services'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await auth.logout(request, { redirectTo: '/' })
}

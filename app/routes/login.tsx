import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react'
import { AuthorizationError } from 'remix-auth'
import { authenticator } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'

	return { returnTo }
}

export default function LoginPage() {
	const navigate = useNavigate()
	const actionData = useActionData<typeof action>()
	const { returnTo } = useLoaderData<typeof loader>()

	return (
		<section>
			<h1>Login</h1>
			<p>Welcome to our website! Please login</p>

			<div>
				<button className='btn' onClick={() => navigate(-1)}>
					back
				</button>
			</div>

			<Form method='POST'>
				<div className='column center'>
					<input type='hidden' name='returnTo' value={returnTo} />
					<input type='email' name='email' placeholder='Email' required />
					{actionData?.error.includes('email') && <p>{actionData.error}</p>}
					<input type='password' name='password' placeholder='Password' required />
					{actionData?.error.includes('password') && <p>{actionData.error}</p>}
					<div>
						<button className='btn' type='submit'>
							Login
						</button>
					</div>
				</div>
			</Form>
		</section>
	)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	try {
		const url = new URL(request.url)
		const returnTo = url.searchParams.get('returnTo') || '/'

		await authenticator.authenticate('user-pass', request, { throwOnError: true })

		return redirect(returnTo)
	} catch (error: unknown) {
		if (error instanceof AuthorizationError) {
			return json({ error: error.message }, { status: 401 })
		}

		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 })
		}
	}
}

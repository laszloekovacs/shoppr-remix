import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react'
import { authenticator } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'

	// redirect if logged in, or return with the error
	const user = await authenticator.isAuthenticated(request, {
		successRedirect: returnTo
	})

	return { returnTo }
}

export default function LoginPage() {
	const navigate = useNavigate()
	const actionData = useActionData<typeof action>()
	const { returnTo } = useLoaderData<typeof loader>()

	console.log('actionData', actionData)

	return (
		<section>
			<h1>Login or Create an Account</h1>
			<p>Welcome to our website! Please login or create an account to continue.</p>

			<div>
				<button className='btn' onClick={() => navigate(-1)}>
					back
				</button>
			</div>

			<div>
				<Form method='POST'>
					<div className='column center'>
						<input type='hidden' name='returnTo' value={returnTo} />
						<input type='email' name='email' placeholder='Email' />
						<input type='password' name='password' placeholder='Password' />

						<div>
							<button className='btn' type='submit'>
								Login
							</button>
							<hr />
						</div>
					</div>
				</Form>
				<Form method='POST'>
					<p>or</p>

					<input type='email' name='email' placeholder='Email' />
					<input type='password' name='password' placeholder='Password' />
					<button className='btn' type='submit' name='intent' value='register'>
						Create Account
					</button>
				</Form>
			</div>
		</section>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'

	await authenticator.authenticate('user-pass', request, {
		successRedirect: returnTo,
		failureRedirect: '/login'
	})
}

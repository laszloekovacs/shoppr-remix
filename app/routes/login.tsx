import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useActionData, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import { authenticator } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'
	return json({ returnTo })
}

export default function LoginPage() {
	const navigate = useNavigate()
	const actionData = useActionData<typeof action>()
	const { returnTo } = useLoaderData<typeof loader>()

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
				<form method='POST'>
					<div className='column center'>
						<input type='hidden' name='returnTo' value={returnTo} />
						<input type='email' name='email' placeholder='Email' />
						<input type='password' name='password' placeholder='Password' />

						<div>
							<button className='btn' type='submit' name='intent' value='login'>
								Login
							</button>
							<hr />
							<p>or</p>
							<button className='btn' type='submit' name='intent' value='register'>
								Create Account
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'

	await authenticator.authenticate('user-pass', request, {
		successRedirect: returnTo
	})

	return null
}

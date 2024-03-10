import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react'
import { hash } from 'bcrypt'
import { CRYPT_SALT } from '~/services/constants.server'
import { db } from '~/services/database.server'
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
			{actionData && <pre>{JSON.stringify(actionData)}</pre>}
		</section>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const url = new URL(request.url)
	const returnTo = url.searchParams.get('returnTo') || '/'

	return authenticator.authenticate('user-pass', request, {
		successRedirect: returnTo
	})
}

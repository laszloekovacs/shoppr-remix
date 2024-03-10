import { ActionFunctionArgs, json } from '@remix-run/node'
import { useActionData, useNavigate } from '@remix-run/react'
import { authenticator } from '~/services/session.server'

export default function LoginPage() {
	const navigate = useNavigate()
	const actionData = useActionData<typeof action>()

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
						<input type='email' name='email' placeholder='Email' />
						<input type='password' name='password' placeholder='Password' />

						<div>
							<button className='btn' type='submit' name='intent' value='login'>
								Login
							</button>
							<br />
							<p>or</p>
							<button className='btn' type='submit' value='intent'>
								Create Account
							</button>
						</div>
					</div>
				</form>
			</div>
			{actionData && <pre>{JSON.stringify(actionData, null, 0)}</pre>}
		</section>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await authenticator.authenticate('user-pass', request)

	return json({ user })
}

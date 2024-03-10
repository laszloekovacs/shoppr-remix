import { ActionFunctionArgs } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'

export default function RegisterPage() {
	const fetcher = useFetcher()

	return (
		<div>
			<h1>Register</h1>

			<fetcher.Form method='POST'>
				<div>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' required autoFocus name='email' placeholder='Email' />
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input type='password' id='password' />
				</div>
				<button type='submit'>Register</button>
			</fetcher.Form>
		</div>
	)
}

export const action = ({ request }: ActionFunctionArgs) => {}

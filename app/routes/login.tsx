import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useNavigate } from '@remix-run/react'
import { auth } from '~/services/index.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await auth.isAuthenticated(request, {
		successRedirect: '/'
	})

	return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
	await auth.authenticate('user-pass', request, {
		successRedirect: '/',
		failureRedirect: '/login'
	})
}

export default function LoginPage() {
	const navigate = useNavigate()

	return (
		<main>
			<Form method='POST'>
				<h1>Login</h1>
				<p>Welcome to our website! Please login</p>

				<div className='mb-3'>
					<label htmlFor='email' className='form-label'>
						Email
					</label>
					<input
						type='email'
						name='email'
						placeholder='Email'
						required
						className='form-control'
					/>
				</div>

				<div className='mb-3'>
					<label htmlFor='password' className='form-label'>
						Password
					</label>
					<input
						type='password'
						name='password'
						placeholder='Password'
						required
						className='form-control'
					/>
				</div>

				<button type='submit' className='btn btn-primary'>
					Login
				</button>

				<div>
					<p>Don't have an account?</p>
					<Link to='/register'>Register</Link>
					<p>Dont want low prices and good deals?</p>
				</div>

				<button
					onClick={() => navigate(-1)}
					className='btn btn-outline-primary'>
					go back
				</button>
			</Form>
		</main>
	)
}

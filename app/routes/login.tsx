import { LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { auth } from '~/services/index.server'
import { action } from '~/routes/api.form.login'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await auth.isAuthenticated(request, {
		successRedirect: '/'
	})

	return null
}

export default function LoginPage() {
	const actionResult = useActionData<typeof action>()

	return (
		<main className='container-fluid'>
			<div className='row justify-content-center'>
				<Form method='POST' action='/api/form/login' className='col max-w-420'>
					<h1 className='mb-3'>Login</h1>
					<p className='mb-3'>Welcome to our website! Please login</p>

					<div className='row mb-3'>
						<div className='col'>
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

							<span className='form-text text-danger col-12'>
								{actionResult?.error == 'email' && 'invalid email'}
							</span>
						</div>
					</div>

					<div className='row mb-3'>
						<div className='col'>
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

							<span className='form-text text-danger'>
								{actionResult?.error == 'password' && 'invalid password'}
							</span>
						</div>
					</div>
					<div className='mb-3'>
						<button type='submit' className='btn btn-primary'>
							Login
						</button>
					</div>

					<p className='mb-3'>
						Don't have an account? <Link to='/register'>Register</Link>
					</p>

					<p>
						Return to <Link to='/'>Home</Link>
					</p>
				</Form>
			</div>
		</main>
	)
}

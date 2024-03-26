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
	try {
		await auth.authenticate('user-pass', request, {
			successRedirect: '/',
			failureRedirect: '/login'
		})
	} catch (err: unknown) {
		return {
			status: 401,
			json: { message: 'Invalid email or password' }
		}
	}
}

export default function LoginPage() {
	const navigate = useNavigate()

	return (
		<main className='max-width-500 mx-auto'>
			<Form method='POST'>
				<div className='mb-5'>
					<h1>Login</h1>
					<p>Welcome to our website! Please login</p>
				</div>

				<div className='mb-3 row'>
					<label htmlFor='email' className='col-sm-2 col-form-label'>
						Email
					</label>
					<div className='col-sm-10'>
						<input
							type='email'
							name='email'
							placeholder='Email'
							required
							className='form-control'
						/>
					</div>
				</div>

				<div className='mb-3 row'>
					<label htmlFor='password' className='col-sm-2 form-label'>
						Password
					</label>
					<div className='col-sm-10'>
						<input
							type='password'
							name='password'
							placeholder='Password'
							required
							className='form-control'
						/>
					</div>
				</div>

				<div className='row'>
					<div className='col-2'>
						<button type='submit' className='btn btn-primary'>
							Login
						</button>
					</div>

					<div className='col-2'>
						<Link className='btn btn-outline-primary' to='/register'>
							Register
						</Link>
					</div>
				</div>

				<div>
					<p>Don't have an account?</p>
					<p>Dont want low prices and good deals?</p>
					<button
						onClick={() => navigate(-1)}
						className='btn btn-outline-primary'>
						go back
					</button>
				</div>
			</Form>
		</main>
	)
}

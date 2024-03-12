import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useNavigate } from '@remix-run/react'
import { auth } from '~/services/session.server'

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
		<section>
			<div className='max-w-[40ch] mx-auto'>
				<Form method='POST' className='grid gap-8'>
					<h1>Login</h1>
					<p>Welcome to our website! Please login</p>

					<input
						type='email'
						name='email'
						placeholder='Email'
						required
						className='border border-black px-2 py-1'
					/>

					<input
						type='password'
						name='password'
						placeholder='Password'
						required
						className='border border-black px-2 py-1'
					/>

					<button type='submit'>Login</button>

					<p>Don't have an account?</p>
					<Link to='/register'>Register</Link>

					<p>Dont want low prices and good deals?</p>
					<div>
						<button onClick={() => navigate(-1)}>go back</button>
					</div>
				</Form>
			</div>
		</section>
	)
}

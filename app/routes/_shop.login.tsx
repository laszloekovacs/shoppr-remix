import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect
} from '@remix-run/node'
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useNavigate
} from '@remix-run/react'
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
			<div className='max-w-[40ch] mx-auto'>
				<Form method='POST' className='grid gap-8'>
					<h1>Login</h1>
					<p>Welcome to our website! Please login</p>

					<input type='hidden' name='returnTo' value={returnTo} />
					<input
						type='email'
						name='email'
						placeholder='Email'
						required
						className='border border-black px-2 py-1'
					/>
					{actionData?.error.includes('email') && <p>{actionData.error}</p>}
					<input
						type='password'
						name='password'
						placeholder='Password'
						required
						className='border border-black px-2 py-1'
					/>
					{actionData?.error.includes('password') && <p>{actionData.error}</p>}

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
	try {
		const url = new URL(request.url)
		const returnTo = url.searchParams.get('returnTo') || '/'

		return authenticator.authenticate('user-pass', request, {
			throwOnError: true,
			successRedirect: returnTo
		})
	} catch (error: unknown) {
		if (error instanceof AuthorizationError) {
			return json({ error: error.message }, { status: 401 })
		}

		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 })
		}
	}
}

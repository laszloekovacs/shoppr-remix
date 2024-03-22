import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { CRYPT_SALT, db, hash } from '~/services/index.server'

export default function RegisterPage() {
	const actionData = useActionData<typeof action>()

	return (
		<main className='container max-width-500'>
			<h1>Register</h1>
			{actionData && actionData?.message && <p>{actionData?.message}</p>}
			<Form method='POST'>
				<div className='form-group mb-3'>
					<label htmlFor='email' className='form-label'>
						Email
					</label>
					<input
						type='email'
						id='email'
						name='email'
						placeholder='Email'
						required
						autoFocus
						className='form-control'
					/>
				</div>
				<div className='form-group mb-3'>
					<label htmlFor='password' className='form-label'>
						Password
					</label>
					<input
						type='password'
						id='password'
						name='password'
						placeholder='Password'
						required
						className='form-control'
					/>
				</div>
				<div className='row'>
					<div className='col'>
						<button type='submit' className='btn btn-primary'>
							Register
						</button>
					</div>
				</div>
			</Form>
		</main>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()

	const email = formData.get('email') as string
	const rawPassword = formData.get('password') as string
	const password = await hash(rawPassword, CRYPT_SALT)

	invariant(email, 'Email is required')
	invariant(password, 'Password is required')

	const user = await db.accounts.findOne({ email })

	if (user) {
		return json({ message: 'User already exists' }, { status: 400 })
	}

	// create the user
	const result = await db.accounts.insertOne({ email, password })

	invariant(result.acknowledged, 'User not created')

	return redirect('/login')
}

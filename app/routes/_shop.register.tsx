import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { hash } from '~/services/session.server'
import invariant from 'tiny-invariant'
import { CRYPT_SALT } from '~/services/constants.server'
import { db } from '~/services/database.server'

export default function RegisterPage() {
	const actionData = useActionData<typeof action>()

	return (
		<div>
			<h1>Register</h1>
			{actionData && actionData?.message && <p>{actionData?.message}</p>}
			<Form method='POST'>
				<div>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						name='email'
						placeholder='Email'
						required
						autoFocus
					/>
				</div>
				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						name='password'
						placeholder='Password'
						required
					/>
				</div>
				<button type='submit'>Register</button>
			</Form>
		</div>
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

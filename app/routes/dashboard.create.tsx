import { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { redirect } from 'react-router'
import { db } from '~/services/database.server'

export default function DashboardCreate() {
	const actionData = useActionData<typeof action>()

	return (
		<div>
			<h2>Create product</h2>

			<Form method='POST'>
				<div className='flex flex-col'>
					<label htmlFor='name'>name of the new product</label>
					<input id='name' name='name' placeholder='name' required />
					<p>{actionData?.name}</p>

					<label htmlFor='brand'>brand</label>
					<input id='brand' type='text' name='brand' placeholder='brand' required />
					<p>{actionData?.brand}</p>

					<button type='submit'>Create</button>
				</div>
			</Form>
		</div>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	// get the form, check if its a non empty string
	const formData = await request.formData()

	const name = formData.get('name')
	const brand = formData.get('brand')

	let errors = {
		formError: '',
		name: '',
		brand: ''
	}

	if (!name && typeof name != 'string') {
		errors.name = 'Name is required'
	}

	if (!brand && typeof brand != 'string') {
		errors.brand = 'Brand is required'
	}

	// try to insert into database
	const result = await db.products.insertOne({
		name,
		brand
	})

	if (result.acknowledged === false) {
		errors.formError = 'Something went wrong, cannot insert into database'
	}

	// if we have errors, return them
	if (Object.values(errors).some(Boolean)) {
		return errors
	}

	return redirect('/')
}

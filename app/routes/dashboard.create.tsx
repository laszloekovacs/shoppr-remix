import { ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { redirect } from 'react-router'
import { db } from '~/services/database.server'

export default function DashboardCreatePage() {
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()

	return (
		<div>
			<h2>Create product</h2>

			<Form method='POST'>
				<div>
					<label htmlFor='name'>name of the new product</label>
					<input id='name' name='name' placeholder='name' required />
					<p>{actionData?.name}</p>

					<label htmlFor='brand'>brand</label>
					<input id='brand' type='text' name='brand' placeholder='brand' required />
					<p>{actionData?.brand}</p>

					<button type='submit' disabled={navigation.state === 'submitting'}>
						{navigation.state === 'submitting' ? 'Creating...' : 'Create'}
					</button>
					<p>{actionData?.formError}</p>
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

	if (!name || !brand) {
		return { formError: 'Form is not formated correctly' }
	}

	let errors = {
		formError: '',
		name: '',
		brand: ''
	}

	if (typeof name != 'string') {
		errors.name = 'Name is required'
	}

	if (typeof brand != 'string') {
		errors.brand = 'Brand is required'
	}

	// check if it already exists
	const product = await db.products.findOne({ name, brand })

	if (product) {
		errors.name = 'Product already exists by this brand'
	} else {
		// try to insert into database
		const result = await db.products.insertOne({
			name,
			brand
		})

		if (result.acknowledged === false) {
			errors.formError = 'Something went wrong, cannot insert into database'
		}
	}

	// if we have errors, return them
	if (Object.values(errors).some(Boolean)) {
		return errors
	}

	return redirect('/dashboard/item/' + brand + '/' + name)
}

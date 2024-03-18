import { ActionFunctionArgs } from '@remix-run/node'
import { Form, Link, json, redirect, useLoaderData } from '@remix-run/react'
import { db } from '~/services/database.server'

export const loader = async () => {
	const items = await db.products.find({}).toArray()
	return json(items)
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

export default function ProductsPage() {
	const items = useLoaderData<typeof loader>()

	return (
		<div>
			<h2>Create Products</h2>

			<Form method='POST' className='flex items-center gap-4'>
				<label htmlFor='name'>Name</label>
				<input
					type='text'
					name='name'
					placeholder='Name'
					className='border border-black py-1 px-2'
				/>

				<label htmlFor='brand'>Brand</label>
				<input
					type='text'
					name='brand'
					placeholder='Brand'
					className='border border-black py-1 px-2'
				/>

				<div>
					<button>Create</button>
				</div>
			</Form>

			<h2>Products</h2>

			<table className='w-full'>
				<tbody>
					{items.map((item: any) => (
						<ProductTableItem
							key={item._id}
							name={item.name}
							brand={item.brand}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}

const ProductTableItem = ({ name, brand }: { name: string; brand: string }) => (
	<tr className='trow'>
		<td>{brand}</td>
		<td>{name}</td>
		<td>
			<Link to={`/dashboard/item/${brand}/${name}`}>details</Link>
		</td>
	</tr>
)

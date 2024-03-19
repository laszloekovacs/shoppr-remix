import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	SerializeFrom
} from '@remix-run/node'
import {
	Form,
	Link,
	json,
	redirect,
	useLoaderData,
	useNavigate,
	useNavigation
} from '@remix-run/react'
import { WithId } from 'mongodb'
import { db } from '~/services/database.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const query = new URL(request.url).searchParams

	const page = parseInt(query.get('page') || '1')
	const limit = parseInt(query.get('limit') || '10')

	// calculate skip
	const skip = (page - 1) * limit

	// get products
	const products = await db.products
		.find<WithId<Product>>({}, { skip, limit })
		.toArray()

	// get distinct brands for autocomplete in datalist
	const brands: string[] = await db.products.distinct('brand')

	return json({ products, brands })
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

	return new Response(null, { statusText: 'Created', status: 201 })
}

export default function ProductsPage() {
	const { products, brands } = useLoaderData<typeof loader>()

	return (
		<main>
			<h2>Create Products</h2>
			<Form method='POST' className='row mb-3'>
				<div className='mb-3 col'>
					<label htmlFor='name' className='form-label'>
						Name
					</label>
					<input
						id='name'
						type='text'
						name='name'
						placeholder='Name'
						className='form-control form-control-sm'
					/>
				</div>

				<div className='mb-3 col'>
					<label htmlFor='brand' className='form-label'>
						Brand
					</label>
					<input
						id='brand'
						type='text'
						name='brand'
						placeholder='Brand'
						className='form-control form-control-sm'
						list='brands'
					/>
					<datalist id='brands'>
						{brands.map((brand: string) => (
							<option key={brand} value={brand} />
						))}
					</datalist>
				</div>

				<div className='col'>
					<button className='btn btn-primary btn-sm'>Create</button>
				</div>
			</Form>

			<ProductTable products={products} />
		</main>
	)
}

const ProductTable = ({
	products
}: {
	products: SerializeFrom<WithId<Product>>[]
}) => {
	return (
		<section>
			<h2>Products</h2>
			<table className='table table-striped'>
				<thead>
					<tr>
						<th>Name</th>
						<th>Brand</th>
					</tr>
				</thead>
				<tbody>
					{products.map(item => (
						<tr key={item._id}>
							<td>
								<Link to={`/dashboard/item/${item.brand}/${item.name}`}>
									{item.name}
								</Link>
							</td>
							<td>{item.brand}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}

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
			<CreateProductForm brands={brands} />
			<ProductTable products={products} />
		</main>
	)
}

const CreateProductForm = ({ brands }: { brands: string[] }) => {
	return (
		<div className='p-4 border-2'>
			<h4 className='mb-4 font-bold'>Create new Product</h4>

			<Form method='POST'>
				<div className='flex flex-col gap-4 mb-4'>
					<div>
						<label htmlFor='name' className='inline-block min-w-20'>
							Name
						</label>
						<input
							id='name'
							type='text'
							name='name'
							placeholder='Name'
							className='form-control'
						/>
					</div>

					<div>
						<label htmlFor='brand' className='inline-block min-w-20'>
							Brand
						</label>
						<input
							id='brand'
							type='text'
							name='brand'
							placeholder='Brand'
							list='brands'
							className='form-control'
						/>
						<datalist id='brands'>
							{brands.map((brand: string) => (
								<option key={brand} value={brand} />
							))}
						</datalist>
					</div>
				</div>

				<div className='text-center'>
					<button className='btn'>Create</button>
				</div>
			</Form>
		</div>
	)
}

const ProductTable = ({
	products
}: {
	products: SerializeFrom<WithId<Product>>[]
}) => {
	return (
		<section className='py-4'>
			<h2 className='mb-4'>Products</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Brand</th>
						<th>Price</th>
						<th>Stock</th>
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
							<td>{item.price}</td>
							<td>{item.stock}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}

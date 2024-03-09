import { Link, useLoaderData } from '@remix-run/react'
import { Heading } from '~/components'
import { db } from '~/services/database.server'

export const loader = async () => {
	const products = db.products.find({}).toArray()
	return products
}

export default function ItemListPage() {
	const products = useLoaderData<typeof loader>()

	return (
		<section>
			<Heading>Products</Heading>

			<ul>
				{products.map(product => (
					<li key={product._id} className='flex flex-row gap-2 border'>
						<p>{product.name}</p>
						<Link to={`/dashboard/item/${product.brand}/${product.name}`}>details</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

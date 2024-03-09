import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/services/database.server'

export const loader = async () => {
	const products = db.products.find({}).toArray()

	return products
}

export default function Items() {
	const products = useLoaderData<typeof loader>()

	return (
		<section>
			<h1>Items</h1>

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

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/services/database.server'

export const meta: MetaFunction = () => {
	return [{ title: 'Shoppr' }, { name: 'description', content: 'the one stop shop' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const products = await db.products.find({}).toArray()
	return products
}

export default function Index() {
	const products = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>Welcome to Shoppr</h1>

			<h2>Products</h2>

			{products.length === 0 && <p>No products found</p>}

			{products.length > 0 && (
				<ul>
					{products.map(product => (
						<li key={product._id}>
							{product.name} - {product.brand}
							<Link to={`/${product.brand}/${product.name}`}>details</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

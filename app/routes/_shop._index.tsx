import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Await, Link, defer, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { db } from '~/services/database.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Shoppr' },
		{ name: 'description', content: 'the one stop shop' }
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const products = db.products.find({}).toArray()
	return defer({ products })
}

export default function Index() {
	const { products } = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>Welcome to Shoppr</h1>

			<h2>Products</h2>
			<Suspense fallback={<p>Loading products...</p>}>
				<Await resolve={products}>
					{products => <List products={products} />}
				</Await>
			</Suspense>
		</div>
	)
}

const List = ({ products }: { products: any[] }) => {
	return (
		<ul>
			{products.map(product => {
				return (
					<li key={product._id}>
						<Link to={`/${product.brand}/${product.name}`}>{product.name}</Link>
					</li>
				)
			})}
		</ul>
	)
}

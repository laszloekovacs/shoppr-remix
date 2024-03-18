import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Await, Link, defer, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Card } from '~/components'
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
		<ul className='grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 content-normal place-content-center'>
			{products.map(product => {
				return (
					<li key={product._id}>
						<Link to={`/${product.brand}/${product.name}`}>
							<Card title={product.name} />
						</Link>
					</li>
				)
			})}
		</ul>
	)
}

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Await, Link, defer, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { Suspense } from 'react'
import { Card } from '~/components'
import { db } from '~/services/index.server'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Shoppr' },
		{ name: 'description', content: 'the one stop shop' }
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const products = db.products.find<WithId<Product>>({}).toArray()
	return defer({ products })
}

export default function Index() {
	const { products } = useLoaderData<typeof loader>()

	return (
		<Suspense fallback={<p>Loading products...</p>}>
			<Await resolve={products}>
				{products => <ProductList products={products} />}
			</Await>
		</Suspense>
	)
}

const ProductList = ({ products }: { products: WithStringId<Product>[] }) => {
	return (
		<section className='row'>
			{products.map(product => (
				<div key={product._id} className='col-6 col-sm-4 col-md-3 col-lg-2'>
					<Link to={`/${product.brand}/${product.name}`} key={product._id}>
						<Card title={product.name} />
					</Link>
				</div>
			))}
		</section>
	)
}

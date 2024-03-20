import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Await, Link, defer, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { Suspense } from 'react'
import { Card } from '~/components'
import { db } from '~/services'

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
		<section className='py-4 grid grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 content-normal place-content-center'>
			{products.map(product => (
				<Link to={`/${product.brand}/${product.name}`} key={product._id}>
					<Card title={product.name} />
				</Link>
			))}
		</section>
	)
}

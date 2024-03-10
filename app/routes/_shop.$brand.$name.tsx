import { LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { db } from '~/services/database.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const product = await db.products.findOne({ name: params.name, brand: params.brand })

	return product
}

export default function ProductPage() {
	const product = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	return (
		<div>
			<h1>Product Page</h1>

			<pre>{JSON.stringify(product, null, 2)}</pre>
			<fetcher.Form method='post'>
				<button>Add to Cart</button>
			</fetcher.Form>
		</div>
	)
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const formData = await request.formData()

	console.log('added to cart')
	return null
}

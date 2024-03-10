import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { db } from '~/services/database.server'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const product = await db.products.findOne({ name: params.name, brand: params.brand })

	return json({ product })
}

export default function ProductPage() {
	const fetcher = useFetcher()
	const { product } = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	return (
		<div>
			<h1>Product Page</h1>
			<div>
				<button onClick={() => navigate(-1)}>back</button>
			</div>
			<pre>{JSON.stringify(product, null, 2)}</pre>
			<fetcher.Form method='post'>
				<button>Add to Cart</button>
			</fetcher.Form>
		</div>
	)
}

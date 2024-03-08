import { LoaderFunctionArgs } from '@remix-run/node'
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react'
import { db } from '~/services/database.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { brand, name } = params

	if (!brand || !name) {
		throw new Response('Not found', { status: 404 })
	}

	// fetch the product from the database
	const product = await db.products.findOne({ name, brand })

	if (!product) {
		throw new Response('Not found', { status: 404 })
	}

	return product
}

export default function ItemPage() {
	const product = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>Item Page</h1>

			<pre>{JSON.stringify(product, null, 2)}</pre>
		</div>
	)
}

export const ErrorBoundary = () => {
	const error = useRouteError()

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>{error.status}</h1>
				<p>{error.data}</p>
			</div>
		)
	}

	return (
		<div>
			<h1>Oops, something went wrong!</h1>
		</div>
	)
}

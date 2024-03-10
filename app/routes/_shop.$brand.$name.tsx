import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import * as mongodb from 'mongodb'
import invariant from 'tiny-invariant'
import { db } from '~/services/database.server'
import { authenticator } from '~/services/session.server'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const product = await db.products.findOne({
		name: params.name,
		brand: params.brand
	})

	if (!product) {
		throw new Response('Not Found', { status: 404 })
	}

	return json({ product })
}

export default function ProductPage() {
	const { product } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const fetcher = useFetcher<typeof action>()

	return (
		<div>
			<h1>Product Page</h1>
			<div>
				<button onClick={() => navigate(-1)}>back</button>
			</div>
			<pre>{JSON.stringify(product, null, 2)}</pre>
			<fetcher.Form method='post'>
				<input type='hidden' name='productId' value={product._id} />
				<button>Add to Cart</button>
			</fetcher.Form>

			{fetcher.data?.message && <p>{fetcher.data.message}</p>}
		</div>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const pathname = new URL(request.url).pathname

	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	const formData = await request.formData()
	const productId = formData.get('productId') as string
	invariant(productId, 'productId is missing')

	const result = await db.accounts.updateOne(
		{
			email: user.email
		},
		{
			$addToSet: {
				cart: productId
			}
		}
	)

	if (!result.acknowledged) {
		throw new Error('Failed to add to cart')
	}

	return json({ message: 'added to cart!' }, { status: 201 })
}

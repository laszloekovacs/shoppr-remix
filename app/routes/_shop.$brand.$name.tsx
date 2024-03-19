import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { WithId } from 'mongodb'
import invariant from 'tiny-invariant'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const product = await db.products.findOne<WithId<Product>>({
		name: params.name,
		brand: params.brand
	})

	invariant(product, 'Product not found')

	return json({ product })
}

export default function ProductPage() {
	const { product } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const fetcher = useFetcher<typeof action>()

	const { _id, brand, name, department } = product

	return (
		<div className='flex gap-4 flex-col'>
			<div>
				<button onClick={() => navigate(-1)}>back</button>
			</div>
			<h1>
				{brand} {name}
			</h1>
			<small className='text-neutral-500'>
				{_id} / {department}
			</small>

			<img src='https://picsum.photos/400/300' alt={name} width={400} />

			<fetcher.Form method='post'>
				<input type='hidden' name='productId' value={product._id} />
				<button>Add to Cart</button>
			</fetcher.Form>

			{fetcher.data?.message && <p>{fetcher.data.message}</p>}
			<pre>{JSON.stringify(product, null, 2)}</pre>
		</div>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const pathname = new URL(request.url).pathname

	const user = await auth.isAuthenticated(request, {
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
				cart: {
					productId,
					quantity: 1
				}
			}
		}
	)

	if (!result.acknowledged) {
		throw new Error('Failed to add to cart')
	}

	return json({ message: 'added to cart!' }, { status: 201 })
}

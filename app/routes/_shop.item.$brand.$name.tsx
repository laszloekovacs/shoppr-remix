import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { WithId } from 'mongodb'
import invariant from 'tiny-invariant'
import { db, auth } from '~/services/index.server'

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
		<main className='my-4'>
			<div className='row my-4'>
				<div className='col'>
					<button
						onClick={() => navigate(-1)}
						className='btn btn-outline-secondary'>
						back
					</button>
				</div>
				<div className='col'>
					<small className='text-neutral-500'>
						{_id} / {department}
					</small>
				</div>
			</div>

			<div>
				<h1>
					<span>{brand}</span>
					<span>{name}</span>
				</h1>
			</div>

			<div className='row'>
				<div className='col-sm-6'>
					<img
						src='https://picsum.photos/400/300'
						alt={name}
						width={400}
						className='img-fluid'
					/>
				</div>
				<div className='col-sm-6'>
					<fetcher.Form method='post'>
						<input type='hidden' name='productId' value={product._id} />
						<button className='btn btn-warning'>Add to Cart</button>
					</fetcher.Form>
					{fetcher.data?.message && <p>{fetcher.data.message}</p>}
				</div>
			</div>
		</main>
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

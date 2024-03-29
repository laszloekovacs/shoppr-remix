import { LoaderFunctionArgs } from '@remix-run/node'
import {
	useActionData,
	useFetcher,
	useLoaderData,
	useNavigate
} from '@remix-run/react'
import { WithId } from 'mongodb'
import { useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { db } from '~/services/index.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')
	const { brand, name } = params

	const product = await db.products.findOne<WithId<Product>>({ name, brand })

	if (!product) {
		throw new Response('Not found', { status: 404 })
	}

	return product
}

export default function ItemPage() {
	const product = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const formRef = useRef<HTMLFormElement>(null)
	const [isEditing, setEditing] = useState(false)
	const fetcher = useFetcher()
	const navigate = useNavigate()

	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		setEditing(false)
		fetcher.submit(event.currentTarget)
	}

	const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		setEditing(!isEditing)
		formRef.current?.reset()
	}

	return (
		<main>
			<div className='my-4'>
				<button
					onClick={() => navigate(-1)}
					className='btn btn-outline-secondary'>
					back
				</button>
			</div>

			<h1>
				{product.name} {product.brand}
			</h1>

			<fetcher.Form method='POST'>
				<button name='intent' value='publish' className='btn btn-dark'>
					publish
				</button>
			</fetcher.Form>

			<div className='my-2'>
				<p>database _id:&nbsp;{product._id}</p>
			</div>

			<fetcher.Form method='POST' ref={formRef}>
				<fieldset disabled={!isEditing}>
					<div>
						<div className='form-group'>
							<label htmlFor='department' className='form-label'>
								Department
							</label>
							<input
								id='department'
								type='text'
								name='department'
								placeholder='Department'
								defaultValue={product?.department}
								className='form-control'
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='price' className='form-label'>
								Unit price
							</label>
							<input
								id='price'
								type='number'
								name='price'
								placeholder='Unit price'
								defaultValue={product?.price}
								className='form-control'
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='stock' className='form-label'>
								Stock
							</label>
							<input
								id='stock'
								type='number'
								name='stock'
								placeholder='Stock'
								defaultValue={product?.stock}
								className='form-control'
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='published' className='form-label'>
								Published
							</label>
							<input
								id='published'
								type='checkbox'
								name='published'
								defaultChecked={product?.isPublished ? true : false}
							/>
						</div>
					</div>

					<button onClick={handleSubmit} className='btn btn-primary'>
						{fetcher.state === 'submitting' ? 'Updating...' : 'Update'}
					</button>
				</fieldset>

				<div className='my-4'>
					<button onClick={handleEdit} className='btn btn-outline-secondary'>
						{isEditing ? 'Cancel' : 'Edit'}
					</button>
				</div>
			</fetcher.Form>
			<p>{actionData?.error}</p>
		</main>
	)
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')
	const { name, brand } = params

	const formData = await request.formData()
	const data = Object.fromEntries(formData)

	// checkbox does not send anything when not on.
	const isPublished = data?.isPublished === 'on' ? true : false

	const result = await db.products.replaceOne(
		{ name, brand },
		{ name, brand, isPublished, ...data }
	)

	if (result.modifiedCount != 1) {
		return { error: 'Could not update product' }
	}

	return new Response(null, { statusText: 'Updated', status: 200 })
}

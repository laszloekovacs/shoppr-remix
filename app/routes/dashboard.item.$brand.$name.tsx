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
import { db } from '~/services/database.server'

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
		<section>
			<header className='flex gap-8 mb-6'>
				<div>
					<button onClick={() => navigate(-1)} className='btn-outline'>
						back
					</button>
				</div>
				<div>
					<h1>
						{product.brand} - {product.name}
					</h1>
				</div>
			</header>

			<section className='flex gap-8 flex-wrap mb-6'>
				<p>database _id:&nbsp;{product._id}</p>
			</section>

			<section className='bg-orange-300 flex p-4 my-8'>
				<fetcher.Form method='POST'>
					<input
						type='submit'
						name='intent'
						value='publish'
						className='btn-outline'
					/>
				</fetcher.Form>
			</section>

			<fetcher.Form method='POST' ref={formRef}>
				<fieldset disabled={!isEditing}>
					<div className='grid gap-2'>
						<div>
							<label htmlFor='department'>Department</label>
							<input
								id='department'
								type='text'
								name='department'
								placeholder='Department'
								defaultValue={product?.department}
								className='input'
							/>
						</div>

						<div>
							<label htmlFor='price'>Unit price</label>
							<input
								id='price'
								type='number'
								name='price'
								placeholder='Unit price'
								defaultValue={product?.price}
								className='input'
							/>
						</div>

						<div>
							<label htmlFor='stock'>Stock</label>
							<input
								id='stock'
								type='number'
								name='stock'
								placeholder='Stock'
								defaultValue={product?.stock}
								className='input'
							/>
						</div>

						<div>
							<label htmlFor='published'>Published</label>
							<input
								id='published'
								type='checkbox'
								name='published'
								defaultChecked={product?.isPublished ? true : false}
							/>
						</div>
					</div>

					<button onClick={handleSubmit} className='btn'>
						{fetcher.state === 'submitting' ? 'Updating...' : 'Update'}
					</button>
				</fieldset>

				<button onClick={handleEdit} className='btn-outline'>
					{isEditing ? 'Cancel' : 'Edit'}
				</button>
			</fetcher.Form>
			<p>{actionData?.error}</p>
		</section>
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

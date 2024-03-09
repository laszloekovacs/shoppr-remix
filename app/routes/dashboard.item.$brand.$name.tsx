import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import {
	Form,
	isRouteErrorResponse,
	useActionData,
	useFetcher,
	useLoaderData,
	useRouteError,
	useSubmit
} from '@remix-run/react'
import { useRef, useState } from 'react'
import { db } from '~/services/database.server'
import invariant from 'tiny-invariant'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')
	const { brand, name } = params

	const product = await db.products.findOne({ name, brand })

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

	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		setEditing(false)

		const data = new FormData(formRef?.current!)
		console.log(data)

		fetcher.submit(event.currentTarget)
	}

	const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		setEditing(!isEditing)
		formRef.current?.reset()
	}

	return (
		<div>
			<h1>
				{product.brand} - {product.name}
			</h1>
			<h2>{product.department}</h2>
			<p>_id: {product._id}</p>

			<fetcher.Form method='POST' ref={formRef}>
				<fieldset disabled={!isEditing}>
					<label htmlFor='department'>Department</label>
					<input id='department' type='text' name='department' defaultValue={product?.department} />

					<label htmlFor='price'>Unit price</label>
					<input id='price' type='number' name='price' defaultValue={product?.price} />

					<label htmlFor='stock'>Stock</label>
					<input id='stock' type='number' name='stock' defaultValue={product?.stock} />

					<label htmlFor='published'>Published</label>
					<input
						id='published'
						type='checkbox'
						name='published'
						defaultChecked={product?.published}
					/>

					<br />
					<button onClick={handleSubmit}>
						{fetcher.state === 'submitting' ? 'Updating...' : 'Update'}
					</button>
				</fieldset>
				<button onClick={handleEdit}>{isEditing ? 'Cancel' : 'Edit'}</button>
			</fetcher.Form>
			<p>{actionData?.error}</p>
			<pre>{JSON.stringify(product, null, 2)}</pre>
		</div>
	)
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')
	const { name, brand } = params

	const formData = await request.formData()
	const data = Object.fromEntries(formData)

	// checkbox does not send anything when not on.
	const published = data?.published === 'on' ? true : false

	const result = await db.products.replaceOne({ name, brand }, { name, brand, ...data, published })

	if (result.modifiedCount !== 1) {
		return { error: 'Could not update product' }
	}

	return null
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

	if (error instanceof Error) {
		return (
			<div>
				<h1>Oops, something went wrong!</h1>
				<pre>{error.message}</pre>
				<pre>{error.stack}</pre>
			</div>
		)
	}

	return (
		<div>
			<h1>Oops, something went wrong!</h1>
		</div>
	)
}

import { LoaderFunctionArgs } from '@remix-run/node'
import { Form, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react'
import { useRef, useState } from 'react'
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
	const formRef = useRef<HTMLFormElement>(null)
	const [isEditing, setEditing] = useState(false)

	const handleEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isEditing) {
			formRef.current?.reset()
			setEditing(false)
		} else {
			setEditing(true)
		}
	}

	return (
		<div>
			<h1>
				{product.brand} - {product.name}
			</h1>
			<h2>{product.department}</h2>
			<p>_id: {product._id}</p>

			<Form method='POST' ref={formRef}>
				<fieldset disabled={!isEditing}>
					<label htmlFor='department'>Department</label>
					<br />
					<input id='department' name='department' defaultValue={product.department} />
					<input type='submit' value='Save' />
				</fieldset>
				<button onClick={handleEditing}>{isEditing ? 'Cancel' : 'Edit'}</button>
			</Form>

			<pre>{JSON.stringify(product, null, 2)}</pre>
		</div>
	)
}

export const action = async ({ request }: LoaderFunctionArgs) => {
	const formData = await request.formData()

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

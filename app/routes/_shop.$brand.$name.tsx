import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { commitSession, getSession } from '~/services/account.server'
import { db } from '~/services/database.server'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const product = await db.products.findOne({ name: params.name, brand: params.brand })

	// get the session from header
	const session = await getSession(request.headers.get('Cookie'))

	return json({ product, data: session?.data || null })
}

export default function ProductPage() {
	const fetcher = useFetcher()
	const { product, data } = useLoaderData<typeof loader>()
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

			<div>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'No session'}</div>
		</div>
	)
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.brand, 'brand is required')
	invariant(params.name, 'name is required')

	const formData = await request.formData()

	console.log('added to cart')

	const session = await getSession(request.headers.get('Cookie'))

	const cart = session.get('cart')
	const newCart = cart ? [...cart, params.name] : [params.name]

	session.set('cart', newCart)

	return json({ status: 'ok' }, { headers: { 'Set-Cookie': await commitSession(session) } })
}

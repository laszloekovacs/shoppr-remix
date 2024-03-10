import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import {
	useActionData,
	useFetcher,
	useLoaderData,
	useNavigate
} from '@remix-run/react'
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
	const fetcher = useFetcher()

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
		</div>
	)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const pathname = new URL(request.url).pathname

	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	console.log('user', user)
	console.log('request', request)

	return json({ message: 'added to cart' }, { status: 201 })
}

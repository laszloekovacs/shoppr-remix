import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const status = url.searchParams.get('status')
	invariant(status, 'status is required')

	return status
}

export default function CheckoutResultPage() {
	const status = useLoaderData<typeof loader>()

	return (
		<div>
			{status === 'success' && <h1>Checkout successful!</h1>}
			{status === 'canceled' && <h1>Checkout canceled</h1>}

			<Link to='/'>Home</Link>
			<Link to='/account/cart'>Account</Link>
		</div>
	)
}

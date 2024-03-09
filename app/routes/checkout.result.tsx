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
			<h1>{status}</h1>

			{status === 'success' && <p>Checkout successful</p>}
			{status === 'canceled' && <p>Checkout canceled</p>}

			<Link to='/'>Home</Link>
		</div>
	)
}
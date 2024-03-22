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
		<section className='place-content-center'>
			<div>
				{status === 'success' ? <Success /> : <Cancelled />}

				<div className='row'>
					<div className='col'>
						<Link to='/'>Return to Home</Link>
					</div>
					<div className='col'>
						<Link to='/account/cart'>Back to Cart</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

const Success = () => (
	<div>
		<h1>Checkout successful!</h1>
		<p>Thank you for your purchase</p>
		<p>your order is on its way (not really)</p>
	</div>
)

const Cancelled = () => (
	<div>
		<h1>Checkout canceled!</h1>
		<p>Your cart is still waiting for you</p>
	</div>
)

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
		<section className='grid place-content-center p-8'>
			<div className='flex flex-col gap-8 text-center'>
				{status === 'success' ? <Success /> : <Cancelled />}

				<div className='flex flex-row gap-8 justify-center'>
					<Link to='/'>Return to Home</Link>
					<Link to='/account/cart'>Back to Cart</Link>
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

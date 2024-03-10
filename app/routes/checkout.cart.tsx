import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { getSession } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const cart = session.get('cart') || []

	return json({ cart })
}

export default function CheckoutCart() {
	const { cart } = useLoaderData<typeof loader>()

	return (
		<section>
			<h1>Checkout Cart</h1>

			<Form method='POST' action='/checkout/payment'>
				<button type='submit'>Go to Payment</button>
			</Form>

			<Link to='/'>Home</Link>

			<pre>{JSON.stringify(cart, null, 2)}</pre>
		</section>
	)
}

import { Form } from '@remix-run/react'

export default function CheckoutCart() {
	return (
		<section>
			<h1>Checkout Cart</h1>

			<Form method='POST' action='/checkout/payment'>
				<button type='submit'>Go to Payment</button>
			</Form>
		</section>
	)
}

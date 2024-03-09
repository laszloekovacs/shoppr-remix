import { Form } from '@remix-run/react'

export default function CheckoutCart() {
	return (
		<section>
			<h1>CheckoutCart</h1>

			<Form method='POST'>
				<button type='submit'>Go to Payment</button>
			</Form>
		</section>
	)
}

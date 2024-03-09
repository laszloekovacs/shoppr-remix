import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { SHOPPR_DOMAIN } from '~/services/constants.server'
import { stripe } from '~/services/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'huf',
					product_data: {
						name: 'T-shirt',
						description: 'A red t-shirt',
						images: ['https://picsum.photos/200'],
						metadata: {
							_id: 23
						}
					}
				},
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `${SHOPPR_DOMAIN}/checkout-result/?status=success`,
		cancel_url: `${SHOPPR_DOMAIN}/checkout-result/?status=canceled`
	})

	if (session.url === null) {
		throw new Error('stripe redirect url is null')
	}

	return redirect(session.url)
}

export default function CheckoutPage() {
	return (
		<section>
			<h1>CheckoutPage</h1>

			<Form method='POST'>
				<button type='submit'>Checkout</button>
			</Form>
		</section>
	)
}

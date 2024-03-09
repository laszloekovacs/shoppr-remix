import { ActionFunctionArgs, json } from '@remix-run/node'

export const action = async ({ request }: ActionFunctionArgs) => {
	const event = await request.json()
	const sig = request.headers.get('stripe-signature')

	console.log(sig)

	// check if the event came from stripe
	//let	event = stripe.webhooks.constructEvent(body, sig, endpointSecret)

	switch (event.type) {
		case 'payment_intent.succeeded':
			console.log('PaymentIntent was successful', event.data.object)
			// handlePaymentIntentSucceeded(event)
			break

		default:
			console.log('Unhandled event type', event.type)
			break
	}

	return json({ received: true })
}

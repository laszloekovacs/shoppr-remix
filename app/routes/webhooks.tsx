import { ActionFunctionArgs, json } from '@remix-run/node'

export const action = async ({ request }: ActionFunctionArgs) => {
	const event = await request.json()

	switch (event.type) {
		case 'payment_intent.succeeded':
			console.log('PaymentIntent was successful', event.data.object)
			break

		default:
			console.log('Unhandled event type', event.type)
			break
	}

	return json({ received: true })
}

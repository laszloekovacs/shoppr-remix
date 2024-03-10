import { ActionFunctionArgs, json } from '@remix-run/node'
import { STRIPE_ENDPOINT_SECRET } from '~/services/constants.server'
import { db } from '~/services/database.server'
import { stripe } from '~/services/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const payload = await request.text()
	const sig = request.headers.get('stripe-signature') as string

	try {
		// check if the event came from stripe
		let event = stripe.webhooks.constructEvent(payload, sig, STRIPE_ENDPOINT_SECRET)

		switch (event.type) {
			case 'checkout.session.completed':
				await db.orders.insertOne(event.data.object)
				break

			default:
				console.log('Unhandled event type', event.type)
				break
		}

		return json({ received: true })
	} catch (err) {
		return json({ received: false })
	}
}

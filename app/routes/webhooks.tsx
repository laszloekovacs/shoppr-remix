import { ActionFunctionArgs, json } from '@remix-run/node'
import { STRIPE_ENDPOINT_SECRET, db, stripeApi } from '~/services/index.server'
import type Stripe from 'stripe'

export const action = async ({ request }: ActionFunctionArgs) => {
	const payload = await request.text()
	const sig = request.headers.get('stripe-signature') as string

	try {
		// check if the event came from stripe
		let event = stripeApi.webhooks.constructEvent(
			payload,
			sig,
			STRIPE_ENDPOINT_SECRET
		)

		// log all webhook events
		await db.logs.insertOne(event)

		switch (event.type) {
			case 'checkout.session.completed':
				handleSessionCompleted(event.data.object as Stripe.Checkout.Session)
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

const handleSessionCompleted = async (session: Stripe.Checkout.Session) => {
	await db.orders.insertOne(session)
}

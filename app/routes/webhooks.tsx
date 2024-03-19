import { ActionFunctionArgs, json } from '@remix-run/node'
import { STRIPE_ENDPOINT_SECRET } from '~/services/constants.server'
import { db } from '~/services/database.server'
import { stripe } from '~/services/stripe.server'
import Stripe from 'stripe'

export const action = async ({ request }: ActionFunctionArgs) => {
	const payload = await request.text()
	const sig = request.headers.get('stripe-signature') as string

	try {
		// check if the event came from stripe
		let event = stripe.webhooks.constructEvent(
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
	const items = await stripe.checkout.sessions.listLineItems(session.id, {
		limit: 100
	})
}

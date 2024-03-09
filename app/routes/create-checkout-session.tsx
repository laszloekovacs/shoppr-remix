import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { stripe } from '~/services/stripe.server'
import { SHOPPR_DOMAIN } from '~/services/constants.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: 'price_1MfDZ5J9hY5HJwDZvzjI5S7x',
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `${SHOPPR_DOMAIN}/finish/?success=true`,
		cancel_url: `${SHOPPR_DOMAIN}/finish/?canceled=true`
	})

	if (session.url === null) {
		throw new Error('stripe redirect url is null')
	}

	return redirect(session.url)
}

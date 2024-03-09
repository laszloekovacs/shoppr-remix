import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { SHOPPR_DOMAIN } from '~/services/constants.server'
import { stripe } from '~/services/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'huf',
					unit_amount: 500000,
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
			},
			{
				price_data: {
					currency: 'huf',
					unit_amount: 230000,
					product_data: {
						name: 'T-shirts',
						description: 'A blue t-shirt',
						images: ['https://picsum.photos/300'],
						metadata: {
							_id: 233
						}
					}
				},
				quantity: 2
			}
		],
		shipping_address_collection: { allowed_countries: ['HU'] },
		mode: 'payment',
		success_url: `${SHOPPR_DOMAIN}/checkout/result/?status=success`,
		cancel_url: `${SHOPPR_DOMAIN}/checkout/result/?status=canceled`
	})

	if (session.url === null) {
		throw new Error('stripe redirect url is null')
	}

	return redirect(session.url)
}

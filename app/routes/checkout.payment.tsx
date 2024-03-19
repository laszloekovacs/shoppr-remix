import { ActionFunctionArgs, redirect } from '@remix-run/node'
import Stripe from 'stripe'
import invariant from 'tiny-invariant'
import { SHOPPR_DOMAIN } from '~/services/constants.server'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'
import { stripe } from '~/services/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	// get user
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login'
	})

	// retrieve users cart
	const account = await db.accounts.findOne<Account>({ where: { email: user } })

	invariant(account, 'account not found')
	invariant(account.cart, 'cart is empty')

	// look up products and format them into line_items
	type LineItem = Stripe.Checkout.SessionCreateParams.LineItem

	const line_items: LineItem[] = account.cart.map(item => {
		return {
			price_data: {
				currency: 'huf',
				unit_amount: 0,
				product_data: {
					name: 'T-shirt',
					description: 'A red t-shirt',
					images: ['https://picsum.photos/200'],
					metadata: {
						product_id: 0
					}
				}
			},
			quantity: 1
		}
	})

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
							order_id: '23'
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
							order_id: '233'
						}
					}
				},
				quantity: 2
			}
		],
		shipping_address_collection: { allowed_countries: ['HU'] },
		mode: 'payment',
		success_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=success`,
		cancel_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=canceled`
	})

	if (session.url === null) {
		throw new Error('stripe redirect url is null')
	}

	return redirect(session.url)
}

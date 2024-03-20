import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { ObjectId, WithId } from 'mongodb'
import Stripe from 'stripe'
import invariant from 'tiny-invariant'
import { SHOPPR_DOMAIN } from '~/services/constants.server'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'
import { stripeApi } from '~/services/stripe.server'

export const action = async ({ request }: ActionFunctionArgs) => {
	// get user
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login'
	})

	// retrieve users cart
	const account = await db.accounts.findOne<Account>({
		email: user.email
	})

	invariant(account, 'account not found')
	invariant(account.cart, 'cart is empty')

	type LineItem = Stripe.Checkout.SessionCreateParams.LineItem
	let line_items: LineItem[] = []

	// loop trough cart items, fetch the product
	for await (const cartItem of account.cart) {
		const product = await db.products.findOne<WithId<Product>>({
			_id: new ObjectId(cartItem.productId)
		})

		invariant(product, 'product not found')

		line_items.push({
			price_data: {
				currency: 'huf',
				unit_amount: product.price! * 100,
				product_data: {
					name: product.name,
					description: product.name,
					images: product.images ?? [],
					metadata: {
						order_id: product._id.toString()
					}
				}
			},
			quantity: cartItem.quantity
		})
	}

	const session = await stripeApi.checkout.sessions.create({
		line_items,
		shipping_address_collection: { allowed_countries: ['HU'] },
		mode: 'payment',
		success_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=success`,
		cancel_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=canceled`
	})

	invariant(session.url, 'stripe redirect url is null')

	return redirect(session.url)
}

/*
 [
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
*/

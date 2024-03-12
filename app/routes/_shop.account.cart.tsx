import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { db, toObjectId } from '~/services/database.server'
import { authenticator } from '~/services/session.server'
import { SHOPPR_DOMAIN } from '~/services/constants.server'
import { stripe } from '~/services/stripe.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const pathname = new URL(request.url).pathname
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	const account = await db.accounts.findOne({ email: user.email })
	invariant(account, 'Account not found')

	// get all products in the cart from database
	const ids = account.cart.map((id: string) => toObjectId(id))
	const items = await db.products.find({ _id: { $in: [...ids] } }).toArray()

	return json({ account, items })
}

export default function AcccountPage() {
	const { account, items } = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>AcccountPage</h1>

			<pre>{JSON.stringify({ account, items }, null, 2)}</pre>

			<Form method='POST'>
				<button type='submit'>Go to Checkout</button>
			</Form>
		</div>
	)
}

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
		success_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=success`,
		cancel_url: `${SHOPPR_DOMAIN}/checkout/thankyou/?status=canceled`
	})

	if (session.url === null) {
		throw new Error('stripe redirect url is null')
	}

	return redirect(session.url)
}

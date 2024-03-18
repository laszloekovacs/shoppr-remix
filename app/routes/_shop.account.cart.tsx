import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Card } from '~/components'
import { db, toObjectId } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const pathname = new URL(request.url).pathname
	const email = await auth.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	const account = await db.accounts.findOne({ email })
	invariant(account, 'Account not found')

	// get all products in the cart from database
	const ids = account.cart?.map((id: string) => toObjectId(id)) ?? []
	const items = await db.products.find({ _id: { $in: [...ids] } }).toArray()

	return json({ email, items })
}

export default function AcccountPage() {
	const { email, items } = useLoaderData<typeof loader>()

	return (
		<div>
			<div className='flex justify-between'>
				<h2>Shopping Cart</h2>
				<Form method='POST' action='/checkout/payment'>
					<button type='submit' disabled={items.length == 0}>
						Go to Checkout
					</button>
				</Form>
			</div>
			{items.length == 0 && (
				<div className='grid place-content-center h-full'>
					<p>No items in your cart!</p>
				</div>
			)}

			{items.length > 0 && (
				<div>
					<ul>
						{items.map(item => (
							<li key={item._id}>
								<CartItem _id={item._id} name={item.name} />
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

type CartItemProps = {
	_id: string
	name: string
}

const CartItem = (props: CartItemProps) => {
	return (
		<article>
			<h3>{props.name}</h3>
			<img src={`http://picsum.photos/200`} alt={props.name} />
			<button>Remove</button>
		</article>
	)
}

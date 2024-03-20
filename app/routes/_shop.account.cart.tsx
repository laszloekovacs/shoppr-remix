import { LoaderFunctionArgs, SerializeFrom, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { ObjectId, WithId } from 'mongodb'
import invariant from 'tiny-invariant'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const pathname = new URL(request.url).pathname
	const user = await auth.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	const account = await db.accounts.findOne<WithId<Account>>({
		email: user.email
	})
	invariant(account, 'Account not found')

	// get all products in the cart from database
	const ids = account.cart?.map(item => new ObjectId(item.productId)) ?? []

	const items = await db.products
		.find<WithId<Product>>({ _id: { $in: [...ids] } })
		.toArray()

	return json({ items })
}

export default function AcccountPage() {
	const { items } = useLoaderData<typeof loader>()

	if (!items)
		return (
			<div>
				<p>No items in your cart!</p>
			</div>
		)

	return (
		<section className='row'>
			<div className='col-sm-8'>
				<CartTable items={items} />
			</div>
			<div className='col-sm-4'>
				<Summary items={items} />
			</div>
		</section>
	)
}

const Summary = ({ items }: { items: SerializeFrom<WithId<Product>>[] }) => {
	return (
		<aside>
			<h2>Summary</h2>

			<Form method='POST' action='/checkout/payment'>
				<button
					type='submit'
					disabled={items.length == 0}
					className='btn btn-primary'>
					Go to Checkout
				</button>
			</Form>
		</aside>
	)
}

const CartTable = (props: { items: SerializeFrom<WithId<Product>>[] }) => {
	const { items } = props

	return (
		<main>
			<header>
				<h2>Shopping Cart</h2>
				<p>
					{items.length} {items.length > 1 ? 'items' : 'item'}
				</p>
			</header>
			<table className='w-full'>
				<thead>
					<tr>
						<th>Product</th>
						<th>Description</th>
						<th>Qty</th>
						<th>Price</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{items.map(item => (
						<tr key={item._id}>
							<td>
								<img src={`http://picsum.photos/100`} alt={item.name} />
							</td>
							<td>
								<h3>{item.name}</h3>
								<p>{item.department}</p>
							</td>
							<td>
								<input type='number' min={1} max={10} />
							</td>
							<td>
								<p>{item.price}</p>
							</td>
							<td>
								<button>Remove</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	)
}

import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import invariant from 'tiny-invariant'
import { db, toObjectId } from '~/services/database.server'
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
	const ids = account.cart?.map((id: string) => toObjectId(id)) ?? []
	const items = await db.products
		.find<WithId<Product>>({ _id: { $in: [...ids] } })
		.toArray()

	return json({ user, items })
}

export default function AcccountPage() {
	const { user, items } = useLoaderData<typeof loader>()

	if (!items)
		return (
			<div className='grid place-content-center h-full'>
				<p>No items in your cart!</p>
			</div>
		)

	return (
		<section className='flex flex-row gap-8 items-start'>
			<main className='flex flex-col'>
				<header className='flex flex-row justify-between py-4'>
					<h2>Shopping Cart</h2>
					<p>
						{items.length} {items.length > 1 ? 'items' : 'item'}
					</p>
				</header>

				<CardTable items={items} />
			</main>

			<aside className='flex flex-col gap-8'>
				<Summary />

				<Form method='POST' action='/checkout/payment'>
					<button type='submit' disabled={items.length == 0} className='btn'>
						Go to Checkout
					</button>
				</Form>
			</aside>
		</section>
	)
}

const CardTable = (props: { items: WithStringId<Product>[] }) => {
	const { items } = props

	return (
		<table className='w-full'>
			<thead>
				<tr>
					<th>Product</th>
					<th>Description</th>
					<th>Modify</th>
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
							<p>modify</p>
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
	)
}

const Summary = () => {
	return <p>summary</p>
}

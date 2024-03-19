import { LoaderFunctionArgs, defer, json } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { Suspense } from 'react'
import Stripe from 'stripe'
import { db } from '~/services/database.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const page = new URL(request.url).searchParams.get('page') || '1'

	const skip = (parseInt(page) - 1) * 10
	const limit = 10

	const orders = db.orders
		.find<Stripe.Checkout.Session>({}, { limit, skip })
		.toArray()

	return defer({ orders })
}

export default function OrdersPage() {
	const { orders } = useLoaderData<typeof loader>()

	return (
		<main>
			<h2>Orders</h2>
			<Suspense fallback={<div>Loading...</div>}>
				<Await resolve={orders}>
					{orders => <OrdersTable session={orders} />}
				</Await>
			</Suspense>
		</main>
	)
}

const OrdersTable = ({ session }: { session: Stripe.Checkout.Session[] }) => {
	const list = session.map(session => {
		return (
			<tr key={session.id}>
				<td>{session.amount_total}</td>
				<td>{session.amount_subtotal}</td>
				<td>{session.created}</td>
			</tr>
		)
	})

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Total</th>
						<th>Subtotal</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>{list}</tbody>
			</table>

			<pre>{JSON.stringify(session, null, 2)}</pre>
		</div>
	)
}

import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Stripe from 'stripe'
import { db } from '~/services/database.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const page = new URL(request.url).searchParams.get('page') || '1'
	const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10')

	const skip = (parseInt(page) - 1) * 10

	const orders = await db.orders
		.find<Stripe.Checkout.Session>({}, { limit, skip })
		.toArray()

	const total = await db.orders.countDocuments()

	return json({ orders, total })
}

export default function OrdersPage() {
	const { orders, total } = useLoaderData<typeof loader>()

	return (
		<main>
			<h2>Orders</h2>
			<OrdersTable session={orders} total={total} />
		</main>
	)
}

const OrdersTable = ({
	session,
	total
}: {
	total: number
	session: Stripe.Checkout.Session[]
}) => {
	return (
		<div>
			<table className='table'>
				<thead>
					<tr>
						<th>Customer</th>
						<th>State</th>
						<th>City</th>
						<th>Total</th>
						<th>Subtotal</th>
					</tr>
				</thead>
				<tbody>
					{session.map(session => (
						<tr key={session.id}>
							<td>{session.customer_details?.email}</td>
							<td>
								<span className='badge text-bg-success'>{'sent'}</span>
							</td>
							<td>{session.customer_details?.address?.city}</td>
							<td>{session.amount_total}</td>
							<td>{session.amount_subtotal}</td>
						</tr>
					))}
				</tbody>
			</table>

			<p>Total pages: {total}</p>
		</div>
	)
}

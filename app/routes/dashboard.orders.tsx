import { LoaderFunctionArgs, defer, json } from '@remix-run/node'
import { Await, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { db } from '~/services/database.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const orders = db.orders.find().toArray()

	return defer({ orders })
}

export default function OrdersPage() {
	const { orders } = useLoaderData<typeof loader>()

	return (
		<div>
			<h2>OrdersPage</h2>
			<Suspense fallback={<div>Loading...</div>}>
				<Await resolve={orders}>{orders => <Formated data={orders} />}</Await>
			</Suspense>
		</div>
	)
}

const Formated = (data: any) => <pre>{JSON.stringify(data, null, 2)}</pre>

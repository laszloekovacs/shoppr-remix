import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { db } from '~/services/database.server'

export const meta: MetaFunction = () => {
	return [{ title: 'Shoppr' }, { name: 'description', content: 'the one stop shop' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const products = await db.products.find({}).toArray()
	return products
}

export default function Index() {
	const products = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>Welcome to Shoppr</h1>

			<pre>{JSON.stringify(products, null, 2)}</pre>
		</div>
	)
}

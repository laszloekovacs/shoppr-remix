import { HeadersFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { stripe } from '~/services/stripe.server'

export const loader = async () => {
	const balance = await stripe.balance.retrieve()

	return { balance }
}

export default function DashboardIndex() {
	const { balance } = useLoaderData<typeof loader>()

	return (
		<div>
			<pre>{JSON.stringify(balance, null, 2)}</pre>
		</div>
	)
}

// cache the headers for 300 seconds, I dont want to spam stripe, not sure it works
export const headers: HeadersFunction = ({ loaderHeaders }) => ({
	'Cache-Control': 'max-age: 300'
})

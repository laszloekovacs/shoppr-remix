import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useSubmit } from '@remix-run/react'
import { db } from '~/services'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// get the query string
	const url = new URL(request.url)
	const q = (url.searchParams.get('q') || '').trim()

	const products = await db.products
		.find(
			{
				$or: [
					{ name: { $regex: q } },
					{ brand: { $regex: q } },
					{ department: { $regex: q } }
				]
			},
			{ limit: 10 }
		)
		.toArray()

	return json({ products, q })
}

export default function Demo() {
	const { products, q } = useLoaderData<typeof loader>()
	const submit = useSubmit()
	const fetcher = useFetcher()

	return (
		<div>
			<fetcher.Form
				onChange={e => {
					submit(e.currentTarget, {
						replace: q != null
					})
				}}>
				<input name='q' type='search' defaultValue={q || ''} />
				<input type='submit' />
			</fetcher.Form>

			<pre>{JSON.stringify(products, null, 2)}</pre>
		</div>
	)
}

import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { AccountButton, Footer } from '~/components'
import { db, auth } from '~/services/index.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request)

	const departments: string[] = await db.products.distinct('department')
	return json({ user, departments })
}

export default function ShopLayout() {
	const { user, departments } = useLoaderData<typeof loader>()

	return (
		<main>
			<header className='d-flex flex-row justify-content-between mb-2'>
				<Link to='/'>
					<h1>Shoppr</h1>
				</Link>
				<div>
					<AccountButton user={user} />
				</div>
			</header>

			<Outlet />
			<Footer />
		</main>
	)
}

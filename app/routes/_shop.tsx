import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { AccountButton, CartButton, Footer } from '~/components'
import { db, auth } from '~/services/index.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// the user
	const user = await auth.isAuthenticated(request)

	// user's cart items count
	let cartQuantity = 0

	if (user) {
		const account = await db.accounts.findOne<WithId<Account>>({
			email: user.email
		})

		if (account && account.cart) {
			cartQuantity = account.cart.reduce((acc, item) => acc + item.quantity, 0)
		}
	}

	// distinct departments set in products
	const departments: string[] = await db.products.distinct('department')
	return json({ user, departments, cartQuantity })
}

export default function ShopLayout() {
	const { user, departments, cartQuantity } = useLoaderData<typeof loader>()

	return (
		<main>
			<header className='d-flex flex-row justify-content-between mb-2'>
				<Link to='/'>
					<h1>Shoppr</h1>
				</Link>
				<div>
					<CartButton count={cartQuantity} />
					<AccountButton user={user} />
				</div>
			</header>

			<Outlet />
			<Footer />
		</main>
	)
}

import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { Footer } from '~/components'
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
				<div>
					<Link to='/'>
						<h1>Shoppr</h1>
					</Link>
				</div>
				<div>
					<div className='row'>
						<div className='col'>
							<CartButton count={cartQuantity} />
						</div>
						<div className='col'>
							<AccountButton user={user} />
						</div>
					</div>
				</div>
			</header>
			<div>
				<Departments departments={departments} />
			</div>
			<Outlet />
			<Footer />
		</main>
	)
}

export const CartButton = ({ count }: { count: number }) => {
	return (
		<Link to='/account/cart' className='btn btn-primary'>
			<span>{count}</span>
		</Link>
	)
}

export const Departments = ({ departments }: { departments: string[] }) => {
	return (
		<div className='container-fuild'>
			<ul className='row'>
				{departments.map(department => (
					<li key={department} className='col'>
						{department}
					</li>
				))}
			</ul>
		</div>
	)
}

export const AccountButton = ({ user }: { user: User | null }) => {
	if (!user) {
		return <Link to='/login'>Login</Link>
	}

	return (
		<section className='row'>
			<div className='col'>
				<Link to='/account/cart'>{user.email}</Link>
			</div>
			<div className='col'>
				<Link to='/api/form/logout'>Logout</Link>
			</div>
		</section>
	)
}

import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request)

	const departments = await db.products.distinct<string>('department')
	return json({ user, departments })
}

export default function ShopLayout() {
	const { user, departments } = useLoaderData<typeof loader>()

	return (
		<main className='container-fluid'>
			<ShopHeader user={user} departments={departments} />
			<Outlet />
			<Footer />
		</main>
	)
}

type ShopHeaderProps = {
	user: User | null
	departments: string[]
}

const ShopHeader = (props: ShopHeaderProps) => {
	const { user, departments } = props

	return (
		<header>
			<Link to='/'>
				<h1>Shoppr</h1>
			</Link>

			<div>
				{user?.email ? (
					<>
						<Link to='/account/cart'>{user?.email}</Link>
						<Link to='/logout'>Logout</Link>
					</>
				) : (
					<Link to='/login'>Login</Link>
				)}
			</div>

			<nav className='d-flex py-2 gap-4'>
				{departments.map(department => (
					<Link key={department} to={`/`}>
						{department}
					</Link>
				))}
			</nav>
		</header>
	)
}

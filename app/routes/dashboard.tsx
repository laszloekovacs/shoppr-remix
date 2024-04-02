import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { AccountButton, Footer } from '~/components'
import { auth } from '~/services/index.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login'
	})
	// this should be the point where we could check for
	// roles and permissions. no jwt token from auth0 sadly.

	return json({ user })
}

export default function DashboardPage() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<main>
			<header className='d-flex flex-row justify-content-between mb-2'>
				<Link to='/dashboard'>
					<h1>Dashboard</h1>
				</Link>
				<div>
					<AccountButton user={user} />
				</div>
			</header>
			<DashboardNavbar />
			<Outlet />
			<Footer />
		</main>
	)
}

const DashboardNavbar = () => {
	const links = [
		{ label: 'Shop', to: '/' },
		{ label: 'Orders', to: '/dashboard/orders' },
		{ label: 'Products', to: '/dashboard/products' }
	]

	return (
		<nav className='nav mb-4'>
			{links.map(link => (
				<Link key={link.to} to={link.to} className='nav-link'>
					{link.label}
				</Link>
			))}
		</nav>
	)
}

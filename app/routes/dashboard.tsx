import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { auth } from '~/services/session.server'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'Orders', to: '/dashboard/orders' },
	{ label: 'Products', to: '/dashboard/products' }
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login'
	})

	return json({ user })
}

export default function DashboardPage() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<main className='container-fluid'>
			<DashboardHeader user={user} />
			<Outlet />
			<Footer />
		</main>
	)
}

type DashboardHeaderProps = {
	user: User
}

const DashboardHeader = (props: DashboardHeaderProps) => {
	const { user } = props

	return (
		<header>
			<div className='d-flex justify-content-between'>
				<Link to='/dashboard'>
					<h1>Dashboard</h1>
				</Link>

				{user && <p>{user.email}</p>}
			</div>

			<nav className='d-flex gap-4'>
				{links.map(link => (
					<Link key={link.to} to={link.to}>
						{link.label}
					</Link>
				))}
			</nav>
		</header>
	)
}

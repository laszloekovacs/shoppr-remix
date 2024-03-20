import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { auth } from '~/services/session.server'

const links = [
	{ label: 'Shop', to: '/' },
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
		<main>
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
		<header className='pb-4'>
			<div className='flex justify-between pb-4'>
				<Link to='/dashboard'>
					<h1>Dashboard</h1>
				</Link>

				<div>
					<p>{user.email}</p>
					<Link to='/logout'>Logout</Link>
				</div>
			</div>

			<nav className='flex flex-row gap-4 py-4  font-bold'>
				{links.map(link => (
					<Link key={link.to} to={link.to}>
						{link.label}
					</Link>
				))}
			</nav>
		</header>
	)
}

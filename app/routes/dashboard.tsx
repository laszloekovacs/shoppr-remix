import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { auth } from '~/services/session.server'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'Create product', to: '/dashboard/create' },
	{ label: 'Items', to: '/dashboard/items' },
	{ label: 'Orders', to: '/dashboard/orders' }
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login'
	})

	return { user }
}

export default function DashboardPage() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<section className='grid grid-rows-layout min-h-screen p-4 gap-4'>
			<div>
				<div className='flex flex-row justify-between'>
					<Link to='/dashboard'>
						<h1>Dashboard</h1>
					</Link>

					<div>{user && <p>{user}</p>}</div>
				</div>

				<nav className='flex gap-2'>
					{links.map(link => (
						<Link key={link.to} to={link.to}>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			<Outlet />

			<Footer />
		</section>
	)
}

import { Link, Outlet } from '@remix-run/react'
import { Footer } from '~/components'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'Create product', to: '/dashboard/create' },
	{ label: 'Items', to: '/dashboard/items' }
]

export default function DashboardPage() {
	return (
		<section className='grid grid-rows-layout min-h-screen p-4 gap-4'>
			<Link to='/dashboard'>
				<h1>Dashboard</h1>
			</Link>
			<nav className='flex gap-2'>
				{links.map(link => (
					<Link key={link.to} to={link.to}>
						{link.label}
					</Link>
				))}
			</nav>
			<Outlet />

			<Footer />
		</section>
	)
}

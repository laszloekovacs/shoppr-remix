import { Link, Outlet } from '@remix-run/react'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'Create product', to: '/dashboard/create' },
	{ label: 'Items', to: '/dashboard/items' }
]

export default function DashboardPage() {
	return (
		<section className='p-4'>
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
		</section>
	)
}

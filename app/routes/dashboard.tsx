import { Link, Outlet } from '@remix-run/react'
import { Flex, Heading } from '~/components'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Create product', to: '/dashboard/create' },
	{ label: 'Items', to: '/dashboard/items' }
]

export default function DashboardPage() {
	return (
		<section>
			<Link to='/dashboard'>
				<Heading>Dashboard</Heading>
			</Link>
			<Flex>
				{links.map(link => (
					<Link key={link.to} to={link.to}>
						{link.label}
					</Link>
				))}
			</Flex>
			<Outlet />
		</section>
	)
}

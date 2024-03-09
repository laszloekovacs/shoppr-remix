import { Outlet } from '@remix-run/react'
import { H1 } from '~/components'

export default function DashboardPage() {
	return (
		<div>
			<H1>Dashboard</H1>
			<Outlet />
		</div>
	)
}

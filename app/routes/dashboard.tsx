import { Outlet } from '@remix-run/react'

export default function DashboardPage() {
	return (
		<div>
			<h1>DashboardPage</h1>
			<Outlet />
		</div>
	)
}

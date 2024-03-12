import { Link, Outlet } from '@remix-run/react'
import { Footer } from '~/components'

export default function ShopLayout() {
	return (
		<main className='grid grid-rows-layout min-h-screen p-4 gap-4'>
			<Link to='/'>
				<h1>Shoppr</h1>
			</Link>

			<Outlet />

			<Footer />
		</main>
	)
}

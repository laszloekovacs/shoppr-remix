import { Link, Outlet } from '@remix-run/react'

export default function ShopLayout() {
	return (
		<main className='grid grid-rows-layout min-h-screen'>
			<div className='p-4'>
				<Link to='/'>
					<h1>Shoppr</h1>
				</Link>
				<nav className='flex gap-2'>
					<Link to='/dashboard'>Dashboard</Link>
					<Link to='/'>Home</Link>
					<Link to='/account/cart'>Checkout</Link>
				</nav>
			</div>
			<div className='px-4'>
				<Outlet />
			</div>

			<footer className='bg-neutral-700 pb-12 p-6 text-neutral-200'>
				<p>&copy; {new Date().getFullYear()} Shoppr</p>
			</footer>
		</main>
	)
}

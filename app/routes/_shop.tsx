import { Link, Outlet } from '@remix-run/react'

export default function ShopLayout() {
	return (
		<main className='grid grid-rows-layout min-h-screen'>
			<Link to='/' className='p-4'>
				<h1>Shoppr</h1>
			</Link>

			<div className='px-4'>
				<Outlet />
			</div>

			<footer className='bg-neutral-900 pb-12 p-6 text-neutral-200'>
				<nav className='flex gap-2'>
					<Link to='/dashboard'>Dashboard</Link>
					<Link to='/'>Home</Link>
					<Link to='/account/cart'>Checkout</Link>
				</nav>
				<p>&copy; {new Date().getFullYear()} Shoppr</p>
			</footer>
		</main>
	)
}

import { Link, Outlet } from '@remix-run/react'

export default function ShopLayout() {
	return (
		<section>
			<h1 className='f1'>Shoppr</h1>
			<nav className='nav'>
				<Link to='/dashboard'>dashboard</Link>
				<Link to='/'>home</Link>
				<Link to='/account/cart'>checkout</Link>
			</nav>

			<Outlet />
		</section>
	)
}

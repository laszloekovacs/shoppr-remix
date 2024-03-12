import { Link } from '@remix-run/react'

export const Footer = () => (
	<footer className='pb-12 p-6 border-t border-t-stone-500'>
		<h3 className='text-lg mb-4 font-semibold'>Debug links</h3>
		<nav className='flex gap-2'>
			<Link to='/dashboard'>Dashboard</Link>
			<Link to='/'>Home</Link>
			<Link to='/account/cart'>Checkout</Link>
		</nav>
	</footer>
)

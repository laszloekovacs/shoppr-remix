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

export const Card = ({ title }: { title: string }) => {
	return (
		<div className='shadow-md rounded-md p-4 inline-block'>
			<h3 className='text-lg font-semibold mb-2'>{title}</h3>
			<img src='https://picsum.photos/200' />
			<p className='text-sm text-stone-500'>This is a card component</p>
		</div>
	)
}

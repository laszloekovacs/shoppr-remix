import { Link } from '@remix-run/react'

export const Footer = () => (
	<footer className='py-5'>
		<h3>Debug links</h3>
		<nav className='d-flex gap-2'>
			<Link to='/dashboard'>Dashboard</Link>
			<Link to='/'>Home</Link>
			<Link to='/account/cart'>Cart</Link>
		</nav>
	</footer>
)

export const Card = ({ title }: { title: string }) => {
	return (
		<div>
			<h3>{title}</h3>
			<img src='https://picsum.photos/200' />
			<span>This is a card component</span>
		</div>
	)
}

import { Link } from '@remix-run/react'

export const Footer = () => (
	<footer className='pt-4 pb-8 text-stone-500'>
		<div className='flex flex-col md:flex-row gap-8 justify-evenly text-center'>
			<nav className='flex gap-4 flex-col'>
				<Link to='/'>Home</Link>
				<Link to='/dashboard'>Dashboard</Link>
				<Link to='/dashboard/orders'>Orders</Link>
				<Link to='/dashboard/products'>Products</Link>
			</nav>
			<nav className='flex gap-4 flex-col'>
				<Link to='/register'>Register</Link>
				<Link to='/checkout/thankyou?status=canceled'>Checkout canceled</Link>
				<Link to='/checkout/thankyou?status=success'>Checkout success</Link>
				<Link to='/account/cart'>Cart</Link>
			</nav>
		</div>
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

import { Link } from '@remix-run/react'

export const Footer = () => {
	const links = [
		{ to: '/', label: 'Home' },
		{ to: '/dashboard', label: 'Dashboard' },
		{ to: '/dashboard/orders', label: 'Orders' },
		{ to: '/dashboard/products', label: 'Products' },
		{ to: '/register', label: 'Register' },
		{ to: '/checkout/thankyou?status=canceled', label: 'Checkout canceled' },
		{ to: '/checkout/thankyou?status=success', label: 'Checkout success' },
		{ to: '/account/cart', label: 'Cart' }
	]

	return (
		<footer className='container-fluid py-5'>
			<div className='container'>
				<ul className='row text-center nav'>
					{links.map(link => (
						<Link
							key={link.to}
							to={link.to}
							className='col-sm-6 col-md-3 nav-link'>
							{link.label}
						</Link>
					))}
				</ul>
			</div>
		</footer>
	)
}

export const Card = ({ title }: { title: string }) => {
	return (
		<div>
			<h3>{title}</h3>
			<img src='https://picsum.photos/200' />
			<span>This is a card component</span>
		</div>
	)
}

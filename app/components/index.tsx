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
		{ to: '/account/cart', label: 'Cart' },
		{ to: '/dashboard/uploads', label: 'Upload' }
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
		<article className='card'>
			<img src='https://picsum.photos/200' className='img-fluid' />
			<div className='card-body'>
				<h4>{title}</h4>
				<span>This is a card component</span>
			</div>
		</article>
	)
}

export const AccountButton = ({ user }: { user: User | null }) => {
	if (!user) {
		return <Link to='/login'>Login</Link>
	}

	return (
		<section className='row'>
			<div className='col'>
				<Link to='/account/cart'>{user.email}</Link>
			</div>
			<div className='col'>
				<Link to='/logout'>Logout</Link>
			</div>
		</section>
	)
}

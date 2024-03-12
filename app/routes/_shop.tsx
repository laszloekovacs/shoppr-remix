import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request)

	return json({ user })
}

export default function ShopLayout() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<main className='grid grid-rows-layout min-h-screen p-4 gap-4'>
			<header className='flex justify-between'>
				<Link to='/'>
					<h1>Shoppr</h1>
				</Link>
				<div className='flex gap-4'>
					<Link to='/account/cart'>{user}</Link>
					{user ? (
						<Link to='/logout'>Logout</Link>
					) : (
						<Link to='/login'>Login</Link>
					)}
				</div>
			</header>

			<Outlet />

			<Footer />
		</main>
	)
}

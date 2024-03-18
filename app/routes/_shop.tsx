import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request)

	const departments = await db.products.distinct<string>('department')

	return json({ user, departments })
}

export default function ShopLayout() {
	const { user, departments } = useLoaderData<typeof loader>()

	return (
		<main className='grid grid-rows-layout min-h-screen p-4 lg:container lg:mx-auto'>
			<ShopHeader user={user} />
			<QuickFilterBar departments={departments} />
			<Outlet />
			<Footer />
		</main>
	)
}

const ShopHeader = ({ user }: { user: any }) => {
	return (
		<header className='flex justify-between'>
			<Link to='/'>
				<h1>Shoppr</h1>
			</Link>
			<div className='flex gap-4 items-center'>
				<Link to='/account/cart'>{user}</Link>
				{user ? (
					<Link to='/logout'>Logout</Link>
				) : (
					<Link to='/login'>Login</Link>
				)}
			</div>
		</header>
	)
}

const QuickFilterBar = ({ departments }: { departments: string[] }) => {
	return (
		<nav className='flex flex-row gap-8 text-lg font-bold'>
			{departments.map(department => (
				<Link key={department} to={`/`}>
					{department}
				</Link>
			))}
		</nav>
	)
}

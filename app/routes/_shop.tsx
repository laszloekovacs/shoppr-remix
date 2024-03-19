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
		<main className='grid grid-rows-layout min-h-screen p-4 mx-auto max-w-[1024px]'>
			<div>
				<ShopHeader user={user} />
				<QuickFilterBar departments={departments} />
			</div>
			<Outlet />
			<Footer />
		</main>
	)
}

const ShopHeader = ({ user }: { user: User | null }) => {
	return (
		<header className='flex justify-between'>
			<Link to='/'>
				<h1>Shoppr</h1>
			</Link>
			<div className='flex gap-4 items-center'>
				{user?.email ? (
					<>
						<Link to='/account/cart'>{user?.email}</Link>
						<Link to='/logout'>Logout</Link>
					</>
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

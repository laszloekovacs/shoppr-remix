import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { Footer } from '~/components'
import { db } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await auth.isAuthenticated(request)

	const departments: string[] = await db.products.distinct('department')
	return json({ user, departments })
}

export default function ShopLayout() {
	const { user, departments } = useLoaderData<typeof loader>()

	return (
		<main className='grid main-layout'>
			<ShopHeader user={user} departments={departments} />
			<Outlet />
			<Footer />
		</main>
	)
}

type ShopHeaderProps = {
	user: User | null
	departments: string[]
}

const ShopHeader = (props: ShopHeaderProps) => {
	const { user, departments } = props

	return (
		<header className='mb-4'>
			<div className='flex flex-row flex-nowrap justify-between pb-4'>
				<Link to='/'>
					<h1 className='mb-4'>Shoppr</h1>
				</Link>

				<div className='flex gap-4'>
					{user?.email ? (
						<>
							<Link to='/account/cart'>{user?.email}</Link>
							<Link to='/logout'>Logout</Link>
						</>
					) : (
						<Link to='/login'>Login</Link>
					)}
				</div>
			</div>

			<nav className='py-4 flex flex-row gap-4 font-bold'>
				{departments.map(department => (
					<Link key={department} to={`/`}>
						{department}
					</Link>
				))}
			</nav>
		</header>
	)
}

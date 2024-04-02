import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { WithId } from 'mongodb'
import { db } from '~/services/index.server'

export const loader = async () => {
	const accounts = await db.accounts.find<WithId<Account>>({}).toArray()

	return json({ accounts })
}

export default function DashboardAccounts() {
	const { accounts } = useLoaderData<typeof loader>()

	return (
		<div>
			<h1>Accounts</h1>
			<ul>
				{accounts.map(account => (
					<li key={account._id}>
						<div>
							<h2>{account.email}</h2>
							<img src={account?.photo} alt={account.email} width={80} />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

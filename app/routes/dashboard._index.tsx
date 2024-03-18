import { useLoaderData } from '@remix-run/react'
import { stripe } from '~/services/stripe.server'

export const loader = async () => {
	const balance = await stripe.balance.retrieve()

	return { balance }
}

export default function DashboardIndex() {
	const { balance } = useLoaderData<typeof loader>()

	return (
		<div className='flex flex-col gap-8'>
			<BalanceTable label='available' currencies={balance.available} />
			<BalanceTable label='pending' currencies={balance.pending} />
			<BalanceTable label='reserved' currencies={balance.connect_reserved} />
		</div>
	)
}

const BalanceTable = ({
	label,
	currencies
}: {
	label: string
	currencies: { amount: number; currency: string }[]
}) => {
	return (
		<section data-id='balanceTable'>
			<h3 className='text-2xl'>{label}</h3>
			<table className='w-full'>
				<thead>
					<tr>
						<th className='text-start'>Amount</th>
						<th>Currency</th>
					</tr>
				</thead>
				<tbody className='text-start'>
					{currencies.map((b, i) => (
						<tr key={i}>
							<td>{b.amount}</td>
							<td className='text-start'>{b.currency}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}

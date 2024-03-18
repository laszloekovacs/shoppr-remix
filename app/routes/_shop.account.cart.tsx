import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { db, toObjectId } from '~/services/database.server'
import { auth } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const pathname = new URL(request.url).pathname
	const email = await auth.isAuthenticated(request, {
		failureRedirect: `/login?returnTo=${pathname}`
	})

	const account = await db.accounts.findOne({ email })
	invariant(account, 'Account not found')

	// get all products in the cart from database
	const ids = account.cart?.map((id: string) => toObjectId(id)) ?? []
	const items = await db.products.find({ _id: { $in: [...ids] } }).toArray()

	return json({ email, items })
}

export default function AcccountPage() {
	const { email, items } = useLoaderData<typeof loader>()

	return (
		<section>
			<h2 className='mb-6'>Shopping Cart</h2>

			{items.length == 0 && (
				<div className='grid place-content-center h-full'>
					<p>No items in your cart!</p>
				</div>
			)}

			{items.length > 0 && (
				<div className='flex flex-col gap-8'>
					<ul className='flex flex-col gap-2'>
						{items.map(item => (
							<CartItem _id={item._id} name={item.name} key={item._id} />
						))}
					</ul>
					<div className='flex flex-row gap-4'>
						<Form method='POST' action='/checkout/payment'>
							<button type='submit' disabled={items.length == 0}>
								Go to Checkout
							</button>
						</Form>
					</div>
				</div>
			)}
		</section>
	)
}

const CartItem = (props: { _id: string; name: string }) => {
	return (
		<article className='flex flex-row gap-4'>
			<img src={`http://picsum.photos/100`} alt={props.name} />
			<div className='flex flex-col justify-between'>
				<h3>{props.name}</h3>
				<div className='flex flex-row gap-4'>
					<div>
						<button>Remove</button>
					</div>
					<div>
						<label htmlFor='quantity'>Quantity</label>
						<input
							id='quantity'
							name='quantity'
							type='number'
							defaultValue='1'
							className='border p-2'
							min={1}
							max={10}
						/>
					</div>
				</div>
			</div>
		</article>
	)
}

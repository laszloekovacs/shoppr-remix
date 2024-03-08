import { ActionFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { redirect } from 'react-router'

export default function DashboardCreate() {
	return (
		<div>
			<h2>Create product</h2>

			<Form method='POST'>
				<div className='flex flex-col'>
					<label htmlFor='name'>name of the new product</label>
					<input id='name' name='name' placeholder='name' required />

					<label htmlFor='brand'>brand</label>
					<input id='brand' type='text' name='brand' placeholder='brand' required />

					<button type='submit'>Create</button>
				</div>
			</Form>
		</div>
	)
}

export const action = ({ request }: ActionFunctionArgs) => {
	return redirect('/')
}

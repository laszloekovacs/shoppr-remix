import { Form } from '@remix-run/react'

export default function ProductsPage() {
	return (
		<div>
			<h2>Create Products</h2>

			<Form method='POST' className='flex items-center gap-4'>
				<label htmlFor='name'>Name</label>
				<input
					type='text'
					name='name'
					placeholder='Name'
					className='border border-black py-1 px-2'
				/>

				<label htmlFor='brand'>Brand</label>
				<input
					type='text'
					name='brand'
					placeholder='Brand'
					className='border border-black py-1 px-2'
				/>

				<div>
					<button>Create</button>
				</div>
			</Form>
		</div>
	)
}

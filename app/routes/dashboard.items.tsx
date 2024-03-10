import { Link, useLoaderData } from '@remix-run/react'
import { db } from '~/services/database.server'

export const loader = async () => {
	return db.products.find({}).toArray()
}

export default function ItemListPage() {
	const products = useLoaderData<typeof loader>()

	return (
		<section>
			<h2>Products</h2>

			<table>
				{products.map(product => (
					<ProductTableItem key={product._id} name={product.name} brand={product.brand} />
				))}
			</table>
		</section>
	)
}

const ProductTableItem = ({ name, brand }: { name: string; brand: string }) => (
	<tr className='trow'>
		<td>{brand}</td>
		<td>{name}</td>
		<td>
			<Link to={`/dashboard/item/${brand}/${name}`}>details</Link>
		</td>
	</tr>
)

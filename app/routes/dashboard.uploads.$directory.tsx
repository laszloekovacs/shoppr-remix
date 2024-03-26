import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import fs from 'fs'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const basepath = 'public/uploads/' + params.directory

	const folder = await fs.promises.readdir(basepath, {
		withFileTypes: true
	})

	const files = folder.filter(file => file.isFile())

	const fileUrls = files.map(file => {
		return file.name
	})

	return json({ fileUrls })
}

export default function UploadsDirectory() {
	const { fileUrls } = useLoaderData<typeof loader>()

	return (
		<div className='container'>
			<h2>Files</h2>
			<ul className='row list-unstyled'>
				{fileUrls.map(fileUrl => {
					return (
						<li key={fileUrl} className='col'>
							<img
								src={'/uploads/2024-03-26/' + fileUrl}
								alt={fileUrl}
								className='img-fluid'
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

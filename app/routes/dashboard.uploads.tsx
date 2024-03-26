import {
	ActionFunctionArgs,
	NodeOnDiskFile,
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData
} from '@remix-run/node'
import { Form, Outlet, useFetcher, useLoaderData } from '@remix-run/react'
import fs from 'fs'

const max_size = 2_000_000

export const action = async ({ request }: ActionFunctionArgs) => {
	// get todays date part

	const today = new Date().toISOString().split('T')[0]

	const uploadHandler = unstable_composeUploadHandlers(
		unstable_createFileUploadHandler({
			maxPartSize: max_size,
			file: ({ filename }) => filename,
			directory: 'public/uploads/' + today
		}),
		unstable_createMemoryUploadHandler()
	)

	const formData = await unstable_parseMultipartFormData(request, uploadHandler)

	const file = formData.get('attachment') as NodeOnDiskFile
	return null
}

export const loader = async () => {
	// list all folders in public/uploads
	const folders = await fs.promises.readdir('public/uploads', {
		withFileTypes: true
	})

	const dirs = folders.filter(folder => folder.isDirectory())

	const folderNames = dirs.map(dir => {
		return dir.name
	})

	return json({ folderNames })
}

export default function UploadsPage() {
	const fetcher = useFetcher()
	const data = useLoaderData<typeof loader>()

	return (
		<section className='container'>
			<div className='row'>
				<div className='col-8 mx-auto'>
					<h2 className='mb-3'>Uploads</h2>

					<fetcher.Form encType='multipart/form-data' method='POST'>
						<div className='mb-3'>
							<label className='form-label'>
								Upload files, max size is ~ {max_size / 1_000_000} MB per file
							</label>
							<input
								className='form-control'
								type='file'
								name='attachment'
								multiple
							/>
						</div>

						<button className='btn btn-primary' type='submit'>
							upload
						</button>
					</fetcher.Form>
				</div>
			</div>
			<div className='row'>
				<div className='col-8 mx-auto'>
					<h2 className='mb-3'>Uploaded Folders</h2>
					<ul>
						{data.folderNames.map((folder: string) => (
							<li key={folder}>{folder}</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}

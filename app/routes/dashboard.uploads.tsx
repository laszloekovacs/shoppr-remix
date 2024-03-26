import {
	ActionFunctionArgs,
	NodeOnDiskFile,
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData
} from '@remix-run/node'
import { Form } from '@remix-run/react'

export const action = async ({ request }: ActionFunctionArgs) => {
	// get todays date part

	const today = new Date().toISOString().split('T')[0]

	const uploadHandler = unstable_composeUploadHandlers(
		unstable_createFileUploadHandler({
			maxPartSize: 5_000_000,
			file: ({ filename }) => filename,
			directory: 'public/uploads/' + today
		}),
		unstable_createMemoryUploadHandler()
	)

	const formData = await unstable_parseMultipartFormData(request, uploadHandler)

	const file = formData.get('attachment') as NodeOnDiskFile
	return null
}

export default function UploadsPage() {
	return (
		<section className='container'>
			<div className='row'>
				<div className='col-8 mx-auto'>
					<h2 className='mb-3'>Uploads</h2>

					<Form encType='multipart/form-data' method='POST'>
						<div className='mb-3'>
							<label className='form-label'>
								Upload files, max size is ~ 5mb
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
					</Form>
				</div>
			</div>
		</section>
	)
}

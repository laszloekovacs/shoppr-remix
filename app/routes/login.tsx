import { useNavigate } from '@remix-run/react'

export default function LoginPage() {
	const navigate = useNavigate()

	return (
		<section>
			<h1>Login or Create an Account</h1>
			<p>Welcome to our website! Please login or create an account to continue.</p>

			<div>
				<button className='btn' onClick={() => navigate(-1)}>
					back
				</button>
			</div>

			<div>
				<form method='POST'>
					<div className='column center'>
						<input type='email' name='email' placeholder='Email' />
						<input type='password' name='password' placeholder='Password' />
						<div>
							<button className='btn' type='submit' value='intent'>
								Login
							</button>
							<button className='btn' type='submit' value='intent'>
								Create Account
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	)
}

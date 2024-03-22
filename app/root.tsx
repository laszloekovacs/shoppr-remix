import { LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLocation,
	useRouteError
} from '@remix-run/react'
import styles from './styles.css'

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
	},
	{ rel: 'stylesheet', href: styles }
]

const Layout = ({ children }: { children: React.ReactNode }) => (
	<html lang='en'>
		<head>
			<meta charSet='utf-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<Meta />
			<Links />
		</head>
		<body className='container-fluid'>
			{children}
			<ScrollRestoration />
			<Scripts />
			<LiveReload />
		</body>
	</html>
)

export default function App() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}

export const ErrorBoundary = () => {
	const error = useRouteError()
	const location = useLocation()

	if (isRouteErrorResponse(error)) {
		return (
			<Layout>
				<div>
					<h1>{error.status}</h1>
					<p>pathname: {location.pathname}</p>
					<p>nothing to see here</p>
					<p>{error.data}</p>
				</div>
			</Layout>
		)
	}

	if (error instanceof Error) {
		return (
			<Layout>
				<h1>Oops, something went wrong!</h1>
				<pre>{error.message}</pre>
				<pre>{error.stack}</pre>
			</Layout>
		)
	}

	return (
		<Layout>
			<h1>Oops, something went wrong!</h1>
		</Layout>
	)
}

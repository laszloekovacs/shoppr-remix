import type { LinksFunction } from '@remix-run/node'
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
import { cssBundleHref } from '@remix-run/css-bundle'
import 'dashvar/dist/base.css'

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
	// ...
]
import * as styles from './styles.css'

const Layout = ({ children }: { children: React.ReactNode }) => (
	<html lang='en' className={styles.themeClass}>
		<head>
			<meta charSet='utf-8' />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<Meta />
			<Links />
		</head>
		<body>
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
				<div className='grid place-content-center min-h-screen'>
					<h1 className='text-5xl mb-4'>{error.status}</h1>
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

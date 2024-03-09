import { ComponentPropsWithRef, forwardRef } from 'react'
import * as styles from '~/styles.css'

export const H1 = ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>

export const H2 = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>

export const Button = forwardRef<HTMLButtonElement, ComponentPropsWithRef<'button'>>(
	({ children, ...props }, ref) => {
		return (
			<button ref={ref} {...props} className={styles.root}>
				{children}
			</button>
		)
	}
)

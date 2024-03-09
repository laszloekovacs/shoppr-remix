import { ComponentPropsWithRef, forwardRef } from 'react'
import * as styles from '~/styles.css'

export const H1 = ({ children }: { children: React.ReactNode }) => (
	<h1 className={styles.heading1}>{children}</h1>
)

export const H2 = ({ children }: { children: React.ReactNode }) => (
	<h2 className={styles.heading2}>{children}</h2>
)

type ButtonProps = {
	variant?: keyof typeof styles.Button
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & ComponentPropsWithRef<'button'>>(
	({ children, ...props }, ref) => {
		return (
			<button ref={ref} {...props} className={styles.Button[props.variant ?? 'primary']}>
				{children}
			</button>
		)
	}
)

export const Card = ({ children }: { children: React.ReactNode }) => (
	<div className={styles.card}>{children}</div>
)

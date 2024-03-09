import { ComponentPropsWithRef, forwardRef } from 'react'
import styles from './index.module.css'

export const H1 = ({ children }: { children: React.ReactNode }) => (
	<h1 className={styles.H1}>{children}</h1>
)

export const H2 = ({ children }: { children: React.ReactNode }) => (
	<h2 className={styles.H2}>{children}</h2>
)

type ButtonProps = {
	children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & ComponentPropsWithRef<'button'>>(
	(props, ref) => <button ref={ref} className={styles.Button} {...props} />
)

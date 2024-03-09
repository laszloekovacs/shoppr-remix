import { style, createTheme, styleVariants } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
	colors: {
		red50: 'hsl(0 100% 50%)',
		red100: 'hsl(0 100% 60%)',
		red200: 'hsl(0 100% 80%)'
	},
	spacing: {
		space0: '0',
		space1: '0.25rem',
		space2: '0.5rem',
		space3: '0.75rem',
		space4: '1rem',
		space5: '1.25rem',
		space6: '1.5rem',
		space7: '1.75rem',
		space8: '2rem',
		space9: '2.25rem',
		space10: '2.5rem'
	}
})

/* Buttons */
export const ButtonBase = style({
	background: vars.colors.red100,
	padding: vars.spacing.space2,
	minWidth: '110px',
	':hover': {
		background: vars.colors.red200
	}
})

export const Button = styleVariants({
	primary: [ButtonBase],
	secondary: [ButtonBase, { background: vars.colors.red200 }]
})

/* Heading */

export const H1 = style({
	fontSize: vars.spacing.space9
})

export const H2 = style({
	fontSize: vars.spacing.space6,
	color: vars.colors.red200
})

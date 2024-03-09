import { style, createTheme, styleVariants, globalStyle } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
	colors: {
		red50: 'hsl(0 95% 50%)',
		red100: 'hsl(0 95% 60%)',
		red200: 'hsl(0 95% 80%)',

		gray: 'hsl(0 0% 18%)'
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
	},
	shadows: {
		shadow1: '0 1px 1px 0 rgba(0, 0, 0, 0.05)',
		shadow2: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
	},
	border: {
		radius0: '0',
		radius1: '0.25rem',
		radius2: '0.5rem',
		radius3: '0.75rem',
		radius4: '1rem',
		full: '9999px'
	}
})

globalStyle('html', {
	color: vars.colors.gray
})

/* Buttons */
const ButtonBase = style({
	background: vars.colors.red100,
	padding: vars.spacing.space2,
	minWidth: '110px',
	':hover': {
		color: 'white'
	},

	':disabled': {
		opacity: 0.5
	}
})

export const Button = styleVariants({
	primary: [ButtonBase],
	secondary: [ButtonBase, { background: vars.colors.red200 }]
})

/* Heading */

export const heading1 = style({
	fontSize: vars.spacing.space9
})

export const heading2 = style({
	fontSize: vars.spacing.space6,
	color: vars.colors.red200
})

export const card = style({
	boxShadow: vars.shadows.shadow2
})

/* macro, page layouts */
export const container = style({
	padding: vars.spacing.space4,
	margin: '0 auto'
})

const flexBaseStyle = style({
	display: 'flex',
	gap: vars.spacing.space2
})

export const flex = styleVariants({
	row: [flexBaseStyle, { flexDirection: 'row' }],
	column: [flexBaseStyle, { flexDirection: 'column' }]
})

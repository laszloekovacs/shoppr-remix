import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				layout: 'auto 1fr auto'
			}
		}
	},
	plugins: []
} satisfies Config

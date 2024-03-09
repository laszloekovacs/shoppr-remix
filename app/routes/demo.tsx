import { Button, H1, H2 } from '~/components'

export default function DemoPage() {
	return (
		<section>
			<H1>Demo page</H1>
			<br />
			<H1>Heading 1</H1>
			<H2>Heading 2</H2>
			<br />
			<Button>Generic button</Button>
			<Button>Btn</Button>
			<Button variant='secondary'>Secondary</Button>
		</section>
	)
}

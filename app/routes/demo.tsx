import { Button, Card, Heading, Subheading } from '~/components'

export default function DemoPage() {
	return (
		<section>
			<Heading>Demo page</Heading>
			<br />
			<Heading>Heading 1</Heading>
			<Subheading>Heading 2</Subheading>
			<br />
			<Button>Generic button</Button>
			<Button>Btn</Button>
			<Button variant='secondary'>Secondary</Button>
			<br />
			<Card>
				<p>Card</p>
				<img src='http://picsum.photos/200/300' alt='card image' />
				<p>hello card</p>
			</Card>
		</section>
	)
}

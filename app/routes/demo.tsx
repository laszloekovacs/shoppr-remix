export default function DemoPage() {
	return (
		<section>
			<h1 className='f1'>Demo page</h1>
			<br />
			<h1 className='f1'>heading 1</h1>
			<h2 className='f2'>heading 2</h2>
			<h3 className='f3'>heading 3</h3>
			<br />
			<button className='btn'>Generic button</button>
			<button className='btn'>Btn</button>

			<br />
			<div>
				<p>Card</p>
				<img src='http://picsum.photos/200/300' alt='card image' />
				<p>hello card</p>
			</div>

			<form className='form'>
				<div className='column center'>
					<legend className='bold'>Sign in</legend>
					<label htmlFor='name' className='bold'>
						Name <span className='normal'>(optional)</span>
					</label>
					<input id='name' type='text' aria-describedby='name-desc' />
					<small id='name-desc'>Helper text for the form control.</small>
					<div>
						<input type='submit' value='Submit' name='intent' className='btn' />
					</div>
				</div>
			</form>
		</section>
	)
}

export default function DemoPage() {
	return (
		<section>
			<h1 className='f1'>Demo page</h1>
			<br />
			<h1 className='f1'>heading 1</h1>
			<h2 className='f2'>heading 2</h2>
			<h3 className='f3'>heading 3</h3>
			<br />
			<button>Generic button</button>
			<button>Btn</button>
			<button>Secondary</button>
			<br />
			<div>
				<p>Card</p>
				<img src='http://picsum.photos/200/300' alt='card image' />
				<p>hello card</p>
			</div>

			<form className='pa4 black-80'>
				<div className='measure'>
					<label htmlFor='name' className='f6 b db mb2'>
						Name <span className='normal black-60'>(optional)</span>
					</label>
					<input
						id='name'
						className='input-reset ba b--black-20 pa2 mb2 db w-100'
						type='text'
						aria-describedby='name-desc'
					/>
					<small id='name-desc' className='f6 black-60 db mb2'>
						Helper text for the form control.
					</small>
				</div>
			</form>
		</section>
	)
}

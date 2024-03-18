type Account = {
	email: string
	password: string
	cart: string[]
}

type Product = {
	name: string
	brand: string
} & Partial<{
	department: string
	price: number
	stock: number
	published: string
	attributes: { [key: string]: string }[]
}>

type WithStringId<T> = T & { _id: string }

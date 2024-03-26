type User = {
	email: string
}

type Account = {
	email: string
	password: string
	cart?: CartItem[]
}

type CartItem = {
	productId: string
	quantity: number
}

type Product = {
	name: string
	brand: string
} & Partial<{
	department: string
	price: number
	stock: number
	isPublished: string
	images: string[]
	attributes: { [key: string]: string }[]
}>

type WithStringId<T> = T & { _id: string }

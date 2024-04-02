type User = {
	email: string
}

type Account = {
	email: string
	password: string
	cart?: CartItem[]
	photo?: string
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

type ProductMetadata = {
	variants?: [{ name: string; price: number; stock: number }]
}

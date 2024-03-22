import { MongoClient, ServerApiVersion } from 'mongodb'
import { singleton } from './singleton.server'
import { MONGODB_CONNECTION_STRING, MONGODB_DATABASE } from './constants.server'

export const mongodb = singleton(
	'mongodb',
	() => new MongoClient(MONGODB_CONNECTION_STRING)
)

export const db = {
	products: mongodb.db(MONGODB_DATABASE).collection('products'),
	orders: mongodb.db(MONGODB_DATABASE).collection('orders'),
	sessions: mongodb.db(MONGODB_DATABASE).collection('sessions'),
	accounts: mongodb.db(MONGODB_DATABASE).collection('accounts'),
	test: mongodb.db(MONGODB_DATABASE).collection('test'),
	logs: mongodb.db(MONGODB_DATABASE).collection('logs')
}

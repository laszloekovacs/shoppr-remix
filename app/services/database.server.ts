import { MongoClient, ObjectId } from 'mongodb'
import { singleton } from './singleton.server'
import { constants } from './constants.server'

const { MONGODB_CONNECTION_STRING, MONGODB_DATABASE } = constants

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

export const toObjectId = (id: string) => new ObjectId(id)

import { MongoClient } from 'mongodb'
import { singleton } from './singleton.server'
import { constants } from './constants.server'

const { MONGODB_CONNECTION_STRING, MONGODB_DATABASE } = constants

export const mongodb = singleton('mongodb', () => new MongoClient(MONGODB_CONNECTION_STRING))

export const db = {
	products: mongodb.db(MONGODB_DATABASE).collection('products'),
	orders: mongodb.db(MONGODB_DATABASE).collection('orders')
}

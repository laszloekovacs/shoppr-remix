export { singleton } from './singleton.server'

export { stripeApi } from './stripe.server'

export { db, mongodb } from './database.server'

export {
	MONGODB_CONNECTION_STRING,
	MONGODB_DATABASE,
	STRIPE_SECRET_KEY,
	STRIPE_ENDPOINT_SECRET,
	SHOPPR_DOMAIN,
	CRYPT_SALT
} from './constants.server'

export { auth } from './session.server'

export { hash } from 'bcrypt'

import { ObjectId } from 'mongodb'
export const toObjectID = (id: string) => new ObjectId(id)

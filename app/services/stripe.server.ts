import { singleton } from './singleton.server'
import Stripe from 'stripe'

import { STRIPE_SECRET_KEY } from './constants.server'

export const stripeApi = singleton(
	'stripe',
	() => new Stripe(STRIPE_SECRET_KEY)
)

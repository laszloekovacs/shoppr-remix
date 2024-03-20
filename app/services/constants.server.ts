const constants = {
	// mongodb
	MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING as string,
	MONGODB_DATABASE: process.env.MONGODB_DATABASE as string,

	// stripe
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
	STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET as string,

	SHOPPR_DOMAIN: process.env.SHOPPR_DOMAIN as string,
	CRYPT_SALT: process.env.CRYPT_SALT as string
}

for (const [key, value] of Object.entries(constants)) {
	if (!value) {
		throw new Error(`Missing ${key} evnironment variable`)
	}
}

export const {
	MONGODB_CONNECTION_STRING,
	MONGODB_DATABASE,
	STRIPE_SECRET_KEY,
	STRIPE_ENDPOINT_SECRET,
	SHOPPR_DOMAIN,
	CRYPT_SALT
} = constants

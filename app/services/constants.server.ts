export const constants = {
	// mongodb
	MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING as string,
	MONGODB_DATABASE: process.env.MONGODB_DATABASE as string
}

for (const [key, value] of Object.entries(constants)) {
	if (!value) {
		throw new Error(`Missing ${key} evnironment variable`)
	}
}

export const { MONGODB_CONNECTION_STRING, MONGODB_DATABASE } = constants

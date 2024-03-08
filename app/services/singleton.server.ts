/**
 * Singletons. puts / gets the value in the global scope. see:
 * https://github.com/remix-run/examples/blob/main/_official-blog-tutorial/app/singleton.server.ts
 *
 * usage:
 *
 * export const db = singleton("prisma", () => new PrismaClient());
 *
 * import as usual
 */

export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
	const g = global as any
	g.__singletons ??= {}
	g.__singletons[name] ??= valueFactory()
	return g.__singletons[name]
}

export default function withDefaults<T extends object>(input: Partial<T>, defaults: T): T {
	return { ...defaults, ...input };
}

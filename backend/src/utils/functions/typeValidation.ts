export function isPositiveInt(x: unknown): x is number {
	return typeof x === "number" && Number.isInteger(x) && x >= 0;
}

export function isPositiveIntStringValid(id: string): boolean {
	const n = Number(id);
	return Number.isInteger(n) && n >= 0;
}

export function isValidNumberDigits(value: unknown, maxDigits: number): value is number {
	if (typeof value !== "number" || !Number.isInteger(value)) return false;
	return value.toString().length <= maxDigits;
}

export function isValidString(value: unknown, maxLength: number): value is string {
	return typeof value === "string" && value.length <= maxLength;
}

export function hasPositiveValidLengthParts(value: unknown, maxIntegerDigits: number, maxDecimalDigits: number): value is number {
	if (typeof value !== "number" || isNaN(value) || value < 0) return false;

	const [integerPart, decimalPart = ""] = value.toString().split(".");
	return typeof integerPart !== "undefined" ? integerPart.length <= maxIntegerDigits && decimalPart.length <= maxDecimalDigits : false;
}

export function isValidTime(value: unknown): value is string {
    if (typeof value !== "string") return false;

    // Acepta "HH:MM" o "HH:MM:SS"
    const regex = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    return regex.test(value);
}

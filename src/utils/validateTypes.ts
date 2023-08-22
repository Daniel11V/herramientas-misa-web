// Función genérica para validar un tipo y asegurarse de que no sea undefined

// export const VALUE_TYPES = {
//     STRING: "STRING",
//     NUMBER: "NUMBER",
//     BOOLEAN: "BOOLEAN",
//     ARRAY: "ARRAY",
//     OBJECT: "OBJECT"
// } as const;
// export type TValueTypes = (typeof VALUE_TYPES)[keyof typeof VALUE_TYPES];

export const validateAndConvert = <T>(
	value: unknown,
	validator: (value: unknown) => value is T,
	errorMessage: string
): T => {
	if (validator(value)) {
		return value;
	} else {
		throw new Error(errorMessage);
	}
};

// Funciones de validación y conversión para cada tipo
export const validateString = (value: unknown): value is string => {
	return typeof value === "string";
};

export const validateBoolean = (value: unknown): value is boolean => {
	return typeof value === "boolean";
};

export const validateNumber = (value: unknown): value is number => {
	return typeof value === "number";
};

export const validateArray = <T>(
	value: unknown,
	elementTypeValidator: (item: unknown) => boolean,
	elementErrorMessage: string
): value is T[] => {
	if (!Array.isArray(value)) {
		throw new Error(elementErrorMessage);
	}

	if (value.every(elementTypeValidator)) {
		return true;
	} else {
		throw new Error(elementErrorMessage);
	}
};

export const validateObject = <T>(
	value: unknown,
	propertyValidators: Record<string, (propertyValue: unknown) => boolean>
): value is T => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		throw new Error("Invalid object");
	}

	const typedValue: Record<string, unknown> = { ...value };
	for (const property in propertyValidators) {
		if (!propertyValidators[property](typedValue[property])) {
			throw new Error(`Invalid property: ${property}`);
		}
	}

	return true;
};

// Ejemplos de uso
const stringValue: unknown = "Hello";
const validString = validateAndConvert(
	stringValue,
	validateString,
	"Invalid string"
);
console.log("Valid string:", validString);

const numberArrayValue: unknown = [1, 2, 3];
const validNumberArray = validateAndConvert<number[]>(
	numberArrayValue,
	(value) => validateArray(value, validateNumber, "Invalid number array")
);
console.log("Valid number array:", validNumberArray);

const personValue: unknown = {
	name: "John",
	age: 30,
};
const validPerson = validateAndConvert<Person>(
	personValue,
	(value) =>
		validateObject(value, {
			name: validateString,
			age: validateNumber,
		}),
	"Invalid person object"
);
console.log("Valid person object:", validPerson);

interface Person {
	name: string;
	age: number;
}

import { TRate } from "../classes/song/types";
import { TUserId } from "../classes/user/types";
import { TypeCreationError, UndefinedError } from "./errors";

export const isAdminUser = (userId: TUserId): boolean => {
	const adminList = ["111418653738749034139"];
	return adminList.includes(userId);
};

// export const automaticLabels = (lyric: string, labels: TSong["labels"]) => {
// 	const onlyLyric = lyric.split("\n").filter((p) => {
// 		p = p.toLowerCase();

// 		if (!p || p.includes("      ")) {
// 			return false;
// 		}

// 		let counter = 0;
// 		for (const key in allChords) {
// 			for (let chord of allChords[key]) {
// 				chord = chord.toLowerCase();
// 				if (p === chord) {
// 					return false;
// 				}

// 				if (p.includes(` ${chord} `)) {
// 					counter++;
// 					if (p.replace(` ${chord} `, "  ").includes(` ${chord} `)) {
// 						counter++;
// 					}
// 				}
// 			}
// 		}

// 		if (counter >= 3) {
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	});

// 	onlyLyric.forEach((p, i, thisArray) => (thisArray[i] = p.trim()));

// 	const manualLabel = false;

// 	if (!manualLabel) {
// 		for (const label in searchLabels) {
// 			for (const keyWords of searchLabels[label]) {
// 				if (lyric.includes(keyWords)) {
// 					// console.log("Incluye: ", label);
// 					if (!labels.includes(label)) {
// 						labels.push(label);
// 					}
// 				}
// 			}
// 		}
// 	}
// };

export const objIsEmpty = (object: object): boolean =>
	!object || Object.keys(object)?.length === 0;
export const arrayIsEmpty = (arr: Array<any>): boolean =>
	!arr || arr.length === 0;

export const objsAreEqual = (
	obj1: { [index: string]: any },
	obj2: { [index: string]: any }
) => {
	// Only they first children
	for (const key in obj1) {
		if (obj1[key] !== obj2[key]) return false;
	}

	for (const key in obj2) {
		if (obj2[key] !== obj1[key]) return false;
	}

	return true;
};

export const getRating = (rates: TRate[] = []): number => {
	let sumatory = 0;
	rates.forEach((rate) => {
		sumatory += rate.userRate;
	});
	const floatRating = sumatory / (Object.values(rates).length || 1);

	const fixedRating = Math.floor(floatRating);
	let finalRating = fixedRating;
	if (floatRating - fixedRating >= 0.5) finalRating += 0.5;

	return finalRating;
};

// Not undefined value
export const valid = <P>(payloadValue: P | undefined, type: string): P => {
	if (payloadValue === undefined) {
		throw new UndefinedError(type);
	} else return payloadValue;
};

// For createTypes.ts
export const validNumber = (value: unknown, typeName: string): number => {
	if (
		value === undefined ||
		value === null ||
		typeof value !== "number" ||
		isNaN(value)
	) {
		throw new TypeCreationError(typeName);
	}
	return value;
};
export const validString = (value: unknown, typeName: string): string => {
	if (value === undefined || value === null || typeof value !== "string") {
		throw new TypeCreationError(typeName);
	}
	return value;
};
export const validBool = (value: unknown, typeName: string): boolean => {
	if (value === undefined || value === null || typeof value !== "boolean") {
		throw new TypeCreationError(typeName);
	}
	return !!value;
};

type ValidationFunction = <P>(value: unknown, typeName: string) => P;
type ArrayValidationFunction = <P>(
	value: unknown,
	typeName: string,
	itemValidation: ValidationFunction
) => P[];
type ObjectValidationFunction = <P extends string, U>(
	value: unknown,
	typeName: string,
	keyValidations: Record<
		string,
		ValidationFunction | ArrayValidationFunction | ObjectValidationFunction
	>
) => Record<P, U>;

export const validRecord = <P extends string, U>(
	value: unknown,
	keyValidation: (item: unknown, typeName: string) => P,
	itemValidation: (item: unknown, typeName: string) => U,
	typeName: string
): Record<P, U> => {
	if (
		value === undefined ||
		value === null ||
		typeof value !== "object" ||
		Array.isArray(value)
	) {
		throw new TypeCreationError(typeName);
	}

	Object.keys(value).forEach((v) => keyValidation(v, typeName));
	Object.values(value).forEach((v) => itemValidation(v, typeName));

	return value as Record<P, U>;
};
// validRecord.validationType = "record";

export const validArray = <P>(
	value: unknown,
	typeName: string,
	itemValidation: {
		func: string;
		params?: Record<string, string>;
	}
): Array<P> => {
	if (value === undefined || value === null || !Array.isArray(value)) {
		throw new TypeCreationError(typeName);
	}

	const validatedArray: Array<any> = [];

	for (const element of value) {
		if (itemValidation.func === "validString") {
			const validatedElement = validString(element, typeName);
			validatedArray.push(validatedElement);
		} else if (itemValidation.func === "validNumber") {
			const validatedElement = validNumber(element, typeName);
			validatedArray.push(validatedElement);
		} else if (itemValidation.func === "validBool") {
			const validatedElement = validBool(element, typeName);
			validatedArray.push(validatedElement);
			// } else if (itemValidation.func === "validArray") {
			// 	const validatedElement = validArray(
			// 		element,
			// 		typeName,
			// 		itemValidation.params
			// 	);
			// 	validatedArray.push(validatedElement);
		} else if (itemValidation.func === "validObject" && itemValidation.params) {
			const validatedElement = validObject(
				element,
				typeName,
				itemValidation.params
			);
			validatedArray.push(validatedElement);
		}
	}

	return validatedArray;

	// value?.forEach((v) => itemValidation(v, typeName));

	// return [...(value as Array<P>)];
};
validArray.validationType = "array";

// type TValidObjectFunc = {
// 	<P extends string, U>(
// 	value: unknown,
// 	keyValidations: Record<string, TValidFunc>,
// 	typeName: string
// ) => Record<P, U>;
// validationType: string;
// }

// type ValidationFunction = (value: unknown, typeName: string) => unknown;
// type TValidFuncMain =
// 	| typeof validNumber
// 	| typeof validString
// 	| typeof validBool;

// type TValidFunc =
// 	| TValidFuncMain
// 	| typeof validRecord
// 	| typeof validArray
// 	| TValidObjectFunc;

export const validObject = <P extends string, U>(
	value: unknown,
	typeName: string,
	keyValidations: Record<string, string>
): Record<P, U> => {
	if (
		value === undefined ||
		value === null ||
		typeof value !== "object" ||
		Array.isArray(value) ||
		typeof Object.keys(value)[0] !== "string"
	) {
		throw new TypeCreationError(typeName);
	}

	const typedValue: Record<string, unknown> = { ...value };

	const validatedObject: Record<P, U> = Object.keys(typedValue).reduce(
		(finalV, key) => {
			if (keyValidations.hasOwnProperty(key)) {
				const validationFunction = keyValidations[key];

				if (validationFunction === "validNumber") {
					const validatedValue = validNumber(typedValue[key], typeName);
					return { ...finalV, [key]: validatedValue };
				}
				if (validationFunction === "validString") {
					const validatedValue = validString(typedValue[key], typeName);
					return { ...finalV, [key]: validatedValue };
				}
				if (validationFunction === "validBool") {
					const validatedValue = validBool(typedValue[key], typeName);
					return { ...finalV, [key]: validatedValue };
				}
				// if (validationFunction === "validArray") {
				// 	validatedValue = validArray(typedValue[key], typeName);
				// }
				// if (validationFunction === "validObject") {
				// 	validatedValue = validObject(typedValue[key], typeName);
				// 	return { ...finalV, [key]: typedValue[key] };
				// }
				return { ...finalV, [key]: typedValue[key] };
			} else {
				return { ...finalV, [key]: typedValue[key] };
			}
		},
		{} as Record<P, U>
	);

	// Object.keys(value).forEach((v) => keyValidation(v, typeName));
	// Object.values(value).forEach((v) => itemValidation(v, typeName));

	// if (
	// 	typeof validatedObject === "object" &&
	// 	Object.keys(validatedObject).length === 0
	// )
	// 	throw new TypeCreationError(typeName);

	return validatedObject;
};
validObject.validationType = "object";

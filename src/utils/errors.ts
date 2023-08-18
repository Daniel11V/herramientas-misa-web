export class ConnectionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConnectionError";
		// this.stack = ""
	}
}

export class UserValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserValidationError";
	}
}

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export class TypeCreationError extends Error {
	constructor(typeName: string) {
		super(`Error in create${typeName}: required prop is missing`);
		this.name = "TypeCreationError";
	}
}

export const errorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

export interface IActionType {
	type: string;
	payload?: any;
}

export type IDispatchType = (args: IActionType) => IActionType;

export type IFetchStatusType = "INITIAL" | "FETCHING" | "SUCCESS" | "FAILURE";
export const fetchStatus: Record<IFetchStatusType, IFetchStatusType> = {
	INITIAL: "INITIAL",
	FETCHING: "FETCHING",
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",
};

export type ISecurityStatusType =
	| "INITIAL"
	| "SHOULD_UPDATE"
	| "PUBLIC"
	| "PRIVATE"
	| "FAILURE";
export const securityStatus: Record<ISecurityStatusType, ISecurityStatusType> =
	{
		INITIAL: "INITIAL",
		SHOULD_UPDATE: "SHOULD_UPDATE",
		PUBLIC: "PUBLIC",
		PRIVATE: "PRIVATE",
		FAILURE: "FAILURE",
	};

export type IChordLangs = "en" | "es";
export const chordLangs: Record<IChordLangs, IChordLangs> = {
	en: "en",
	es: "es",
};

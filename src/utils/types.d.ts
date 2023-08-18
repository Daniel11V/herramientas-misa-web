export type TActionType = {
	type: string;
	payload?: any;
};

export type TDispatchType = (args: TActionType) => TActionType;

export const FETCH_STATUS = {
	INITIAL: "INITIAL",
	FETCHING: "FETCHING",
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",
} as const;
export type TFetchStatus = (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];

export const SECURITY_STATUS = {
	INITIAL: "INITIAL",
	SHOULD_UPDATE: "SHOULD_UPDATE",
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE",
	FAILURE: "FAILURE",
};
export type TSecurityStatus =
	(typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS];

export const CHORD_LANGS = {
	EN: "en",
	ES: "es",
};
export type TChordLangs = (typeof CHORD_LANGS)[keyof typeof CHORD_LANGS];

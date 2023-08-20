// export type TDispatch<P> = (args: TAction<P>) => TAction<P>;

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
} as const;
export type TSecurityStatus =
	(typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS];

export type TsetFunc<P> = React.Dispatch<React.SetStateAction<P>>;

// export type TDispatch<P> = (args: TAction<P>) => TAction<P>;

import { Dispatch, SetStateAction } from "react";
import { TPageSelectedActionPayload } from "../classes/page/reducers";
import { TSongSelectedActionPayload } from "../classes/song/reducers";
import { TAuthorSelectedActionPayload } from "../classes/author/reducers";

export const FETCH_STATUS = {
	INITIAL: "INITIAL",
	FETCHING: "FETCHING",
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",
} as const;
export type TFetchStatus = (typeof FETCH_STATUS)[keyof typeof FETCH_STATUS];

export const SONG_LIST_TYPE = {
	INITIAL: "INITIAL",
	SHOULD_UPDATE: "SHOULD_UPDATE",
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE",
	FAILURE: "FAILURE",
} as const;
export type TSongListType =
	(typeof SONG_LIST_TYPE)[keyof typeof SONG_LIST_TYPE];
	
export const SECURITY_STATUS = {
	INITIAL: "INITIAL",
	SHOULD_UPDATE: "SHOULD_UPDATE",
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE",
	FAILURE: "FAILURE",
} as const;
export type TSecurityStatus =
	(typeof SECURITY_STATUS)[keyof typeof SECURITY_STATUS];

export type TsetFunc<P> = Dispatch<SetStateAction<P>>;

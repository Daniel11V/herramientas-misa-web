import { produce } from "immer";
import { TAuthorDB, TAuthorId, TAuthorListDB } from "./types";
import { TFetchStatus, FETCH_STATUS } from "../../utils/types";
import { Dispatch } from "redux";
import { valid } from "../../utils/generalUtils";
import { types } from "./actions";

const defaultAuthor: TAuthorDB = {
	id: "",
	name: "",
	email: "",
	photoUrl: "",
	creatorId: "",
	songTitleIds: [],
};

export type TAuthorState = {
	authorStatus: TFetchStatus;
	authorError: string | null;

	authorList: TAuthorListDB;
	author: TAuthorDB;
};

const initialState: TAuthorState = {
	authorStatus: FETCH_STATUS.INITIAL,
	authorError: null,

	authorList: {},
	author: defaultAuthor,
};

export type TAuthorActionType = (typeof types)[keyof typeof types];

export type TAuthorActionPayload = Partial<TAuthorState> & {
	authorCreated?: TAuthorDB;
	authorEdited?: TAuthorDB;
	authorDeletedId?: TAuthorId;
};

export type TAuthorAction = {
	type: TAuthorActionType;
	payload?: TAuthorActionPayload;
};

const AuthorReducer = (
	state = initialState,
	{ type, payload }: TAuthorAction
) => {
	return produce(state, (newState: TAuthorState): void => {
		if (type === types.RESET_AUTHOR_STATUS) {
			newState.authorStatus = FETCH_STATUS.INITIAL;
			newState.authorError = null;
		}

		if (type === types.SET_AUTHOR_LIST) {
			newState.authorList = valid(payload?.authorList, type);
			newState.authorStatus = valid(payload?.authorStatus, type);
		}
		if (type === types.SET_AUTHOR_LIST_STATUS) {
			newState.authorStatus = valid(payload?.authorStatus, type);
			newState.authorError = valid(payload?.authorError, type);
		}
		if (type === types.SET_AUTHOR) {
			newState.author = valid(payload?.author, type);
			newState.authorStatus = valid(payload?.authorStatus, type);
		}
		if (type === types.SET_AUTHOR_STATUS) {
			newState.authorStatus = valid(payload?.authorStatus, type);
			newState.authorError = valid(payload?.authorError, type);
		}

		if (type === types.CREATE_AUTHOR) {
			let authorCreated = valid(payload?.authorCreated, type);
			newState.authorList[authorCreated.id] = authorCreated;
			newState.author = authorCreated;
		}
		if (type === types.EDIT_AUTHOR) {
			let authorEdited = valid(payload?.authorEdited, type);
			newState.authorList[authorEdited.id] = authorEdited;
			newState.author = authorEdited;
		}
		if (type === types.DELETE_AUTHOR) {
			let authorDeletedId = valid(payload?.authorDeletedId, type);
			delete newState.authorList[authorDeletedId];
			newState.author = defaultAuthor;
		}
	});
};

// export type TAuthorDispatch = Dispatch<TAuthorActionPayload>;
export type TAuthorSelectedActionPayload = {
	[types.RESET_AUTHOR_STATUS]: undefined;

	// [types.SET_AUTHOR_LIST]: Pick<TAuthorActionPayload, "authorList" & "authorStatus">
	[types.SET_AUTHOR_LIST]: {
		authorList: TAuthorActionPayload["authorList"];
		authorStatus: TAuthorActionPayload["authorStatus"];
	};
	[types.SET_AUTHOR_LIST_STATUS]: {
		authorStatus: string;
		authorError: string | null;
	};

	[types.SET_AUTHOR]: {};
	[types.SET_AUTHOR_STATUS]: {};

	[types.CREATE_AUTHOR]: {};
	[types.CREATE_AUTHOR_STATUS]: {};

	[types.EDIT_AUTHOR]: {};
	[types.EDIT_AUTHOR_STATUS]: {};

	[types.DELETE_AUTHOR]: {};
	[types.DELETE_AUTHOR_STATUS]: {};
};

type TAuthorSelectedAction<T extends TAuthorActionType> = {
	type: T;
	payload: TAuthorSelectedActionPayload[T];
};

export type TAuthorDispatch = <T extends TAuthorActionType>(
	action: TAuthorSelectedAction<T>
) => Dispatch<TAuthorSelectedAction<T>>;

export default AuthorReducer;

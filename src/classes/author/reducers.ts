import { produce } from "immer";
import { types } from "./actions";
import { TAuthorDB, TAuthorId, TAuthorListDB } from "./types";
import { TFetchStatus, FETCH_STATUS } from "../../utils/types";
import { ActionError } from "../../utils/errors";
import { Dispatch } from "redux";

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

export type TAuthorAction = {
	type: string;
	payload?: Partial<TAuthorState> & {
		authorCreated?: TAuthorDB;
		authorEdited?: TAuthorDB;
		authorDeletedId?: TAuthorId;
	};
};

const AuthorReducer = (
	state = initialState,
	{ type, payload }: TAuthorAction
) => {
	return produce(state, (newState: TAuthorState): void => {
		switch (type) {
			case types.RESET_AUTHOR_STATUS:
				newState.authorStatus = FETCH_STATUS.INITIAL;
				newState.authorError = null;
				break;

			case types.SET_AUTHOR_LIST:
				if (payload?.authorList && payload?.authorStatus) {
					newState.authorList = payload.authorList;
					newState.authorStatus = payload.authorStatus;
				} else throw new ActionError(type);
				break;
			case types.SET_AUTHOR_LIST_STATUS:
				if (payload?.authorError && payload?.authorStatus) {
					newState.authorStatus = payload?.authorStatus;
					newState.authorError = payload?.authorError;
				} else throw new ActionError(type);
				break;

			case types.SET_AUTHOR:
				if (payload?.author && payload?.authorStatus) {
					newState.author = payload?.author;
					newState.authorStatus = payload?.authorStatus;
				} else throw new ActionError(type);
				break;
			case types.SET_AUTHOR_STATUS:
				if (payload?.authorError && payload?.authorStatus) {
					newState.authorStatus = payload?.authorStatus;
					newState.authorError = payload?.authorError;
				} else throw new ActionError(type);
				break;

			case types.CREATE_AUTHOR:
				if (payload?.authorCreated) {
					newState.authorList[payload.authorCreated.id] = payload.authorCreated;
					newState.author = payload?.authorCreated;
				} else throw new ActionError(type);
				break;
			case types.EDIT_AUTHOR:
				if (payload?.authorEdited) {
					newState.authorList[payload?.authorEdited.id] = payload?.authorEdited;
					newState.author = payload?.authorEdited;
				} else throw new ActionError(type);
				break;
			case types.DELETE_AUTHOR:
				if (payload?.authorDeletedId) {
					delete newState.authorList[payload?.authorDeletedId];
					newState.author = defaultAuthor;
				} else throw new ActionError(type);
				break;

			default:
				break;
		}
	});
};

export type TAuthorDispatch = Dispatch<TAuthorAction>;

export default AuthorReducer;

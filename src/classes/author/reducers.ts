import { produce } from "immer";
import { types } from "./actions";
import { TAuthorDB } from "./types";
import { TActionType, TFetchStatus, FETCH_STATUS } from "../../utils/types";

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

	authorList: TAuthorDB[];
	author: TAuthorDB;
};

const initialState: TAuthorState = {
	authorStatus: FETCH_STATUS.INITIAL,
	authorError: null,

	authorList: [],
	author: defaultAuthor,
};

const AuthorReducer = (
	state: TAuthorState = initialState,
	{ type, payload }: TActionType
) => {
	return produce(state, (newState: TAuthorState) => {
		switch (type) {
			case types.RESET_AUTHOR_STATUS:
				newState.authorStatus = FETCH_STATUS.INITIAL;
				newState.authorError = null;
				break;

			case types.SET_AUTHOR_LIST:
				newState.authorList = payload.authorList;
				newState.authorStatus = payload.authorStatus;
				break;
			case types.SET_AUTHOR_LIST_STATUS:
				newState.authorStatus = payload.authorStatus;
				newState.authorError = payload.error;
				break;

			case types.SET_AUTHOR:
				newState.author = payload.author;
				newState.authorStatus = payload.authorStatus;
				break;
			case types.SET_AUTHOR_STATUS:
				newState.authorStatus = payload.authorStatus;
				newState.authorError = payload.error;
				break;

			case types.CREATE_AUTHOR:
				newState.authorList[payload.authorCreated.id] = payload.authorCreated;
				newState.author = payload.authorCreated;
				break;
			case types.EDIT_AUTHOR:
				newState.authorList[payload.authorEdited.id] = payload.authorEdited;
				newState.author = payload.authorEdited;
				break;
			case types.DELETE_AUTHOR:
				delete newState.authorList[payload.authorDeletedId];
				newState.author = defaultAuthor;
				break;

			default:
				break;
		}
	});
};

export default AuthorReducer;

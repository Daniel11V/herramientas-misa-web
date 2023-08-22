// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { TDispatch, TStoreState } from "../../store.js";
import { FETCH_STATUS } from "../../utils/types.js";
import { objIsEmpty } from "../../utils/generalUtils.js";
import {
	getAuthorListDB,
	getAuthorDB,
	createAuthorDB,
	editAuthorDB,
	deleteAuthorDB,
} from "./services/authorList.js";
import { TAuthorDB } from "./types.js";
import { errorMessage } from "../../utils/errors.js";

export const types = {
	RESET_AUTHOR_STATUS: "RESET_AUTHOR_STATUS",

	SET_AUTHOR_LIST: "SET_AUTHOR_LIST",
	SET_AUTHOR_LIST_STATUS: "SET_AUTHOR_LIST_STATUS",

	SET_AUTHOR: "SET_AUTHOR",
	SET_AUTHOR_STATUS: "SET_AUTHOR_STATUS",

	CREATE_AUTHOR: "CREATE_AUTHOR",
	CREATE_AUTHOR_STATUS: "CREATE_AUTHOR_STATUS",

	EDIT_AUTHOR: "EDIT_AUTHOR",
	EDIT_AUTHOR_STATUS: "EDIT_AUTHOR_STATUS",

	DELETE_AUTHOR: "DELETE_AUTHOR",
	DELETE_AUTHOR_STATUS: "DELETE_AUTHOR_STATUS",
} as const;

export const resetAuthorStatus = () => ({
	type: types.RESET_AUTHOR_STATUS,
});

// Thunks

export const getAuthorList = () => {
	return async (dispatch: TDispatch) => {
		// const authorDispatch = createAuthorDispatch(dispatch);
		try {
			dispatch({
				type: types.SET_AUTHOR_LIST_STATUS,
				payload: { authorStatus: FETCH_STATUS.FETCHING, authorError: null },
			});

			const authorList = await getAuthorListDB();

			dispatch({
				type: types.SET_AUTHOR_LIST,
				payload: { authorList, authorStatus: FETCH_STATUS.SUCCESS },
			});
		} catch (err) {
			console.warn(err);
			dispatch({
				type: types.SET_AUTHOR_LIST_STATUS,
				payload: {
					authorStatus: FETCH_STATUS.FAILURE,
					authorError: errorMessage(err),
				},
			});
		}
	};
};

export const getAuthor = (p: { authorId: string }) => {
	const { authorId } = p;

	return async (dispatch: TDispatch, getState: () => TStoreState) => {
		try {
			dispatch({
				type: types.SET_AUTHOR_STATUS,
				payload: { authorStatus: FETCH_STATUS.FETCHING, authorError: null },
			});

			///////////////////////////////

			const { authorList } = getState().author;
			let author;

			if (!objIsEmpty(authorList)) {
				author = authorList[authorId];
			} else {
				author = await getAuthorDB({ authorId });
			}

			///////////////////////////////

			dispatch({
				type: types.SET_AUTHOR,
				payload: { author, authorStatus: FETCH_STATUS.SUCCESS },
			});
		} catch (err) {
			console.warn(err);
			dispatch({
				type: types.SET_AUTHOR_STATUS,
				payload: {
					authorStatus: FETCH_STATUS.FAILURE,
					authorError: errorMessage(err),
				},
			});
		}
	};
};

export const createAuthor = (p: {
	authorCreated: TAuthorDB;
	saveAsPublic?: boolean;
}) => {
	const { authorCreated, saveAsPublic = true } = p;

	return async (dispatch: TDispatch) => {
		try {
			dispatch({
				type: types.CREATE_AUTHOR_STATUS,
				payload: { authorStatus: FETCH_STATUS.FETCHING, authorError: null },
			});

			authorCreated.id = new Date().getTime().toString();

			await createAuthorDB({ authorCreated });

			dispatch({
				type: types.CREATE_AUTHOR,
				payload: {
					authorCreated: authorCreated,
				},
			});
		} catch (err) {
			console.warn(err);
			dispatch({
				type: types.CREATE_AUTHOR_STATUS,
				payload: {
					authorStatus: FETCH_STATUS.FAILURE,
					authorError: errorMessage(err),
				},
			});
		}
	};
};

export const editAuthor = (p: {
	authorEdited: TAuthorDB;
	saveAsPublic?: boolean;
}) => {
	const { authorEdited, saveAsPublic = false } = p;

	return async (dispatch: TDispatch) => {
		try {
			dispatch({
				type: types.EDIT_AUTHOR_STATUS,
				payload: { authorStatus: FETCH_STATUS.FETCHING, authorError: null },
			});

			await editAuthorDB({ authorEdited });

			dispatch({
				type: types.EDIT_AUTHOR,
				payload: { authorEdited },
			});
		} catch (err) {
			console.warn(err);
			dispatch({
				type: types.EDIT_AUTHOR_STATUS,
				payload: {
					authorStatus: FETCH_STATUS.FAILURE,
					authorError: errorMessage(err),
				},
			});
		}
	};
};

export const deleteAuthor = (p: {
	authorDeletedId: string;
	saveAsPublic?: boolean;
}) => {
	const { authorDeletedId, saveAsPublic = false } = p;

	return async (dispatch: TDispatch) => {
		try {
			dispatch({
				type: types.DELETE_AUTHOR_STATUS,
				payload: { authorStatus: FETCH_STATUS.FETCHING, authorError: null },
			});

			deleteAuthorDB({ authorDeletedId });

			dispatch({
				type: types.DELETE_AUTHOR,
				payload: { authorDeletedId },
			});
		} catch (err) {
			console.warn(err);
			dispatch({
				type: types.DELETE_AUTHOR_STATUS,
				payload: {
					authorStatus: FETCH_STATUS.FAILURE,
					authorError: errorMessage(err),
				},
			});
		}
	};
};

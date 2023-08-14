// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import store from "../../store.js";
import { DispatchType } from "../../utils/types.js";
import { arrayIsEmpty } from "../../utils/lyricsAndChordsUtils.js";
import {
	getAuthorListDB,
	getAuthorDB,
	createAuthorDB,
	editAuthorDB,
	deleteAuthorDB,
} from "./services/authorList.js";
import { IAuthorDB } from "./types.js";

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
};

export const resetAuthorStatus = () => ({
	type: types.RESET_AUTHOR_STATUS,
});

// Thunks

export const getAuthorList = () => {
	return async (dispatch: DispatchType): Promise<void> => {
		try {
			dispatch({
				type: types.SET_AUTHOR_LIST_STATUS,
				payload: { authorStatus: "FETCHING", error: null },
			});

			const authorListObject = await getAuthorListDB();
			const authorList = Object.values(authorListObject || {});

			dispatch({
				type: types.SET_AUTHOR_LIST,
				payload: { authorList, authorStatus: "SUCCESS" },
			});
		} catch (err) {
			console.warn(errorMessage(err));
			dispatch({
				type: types.SET_AUTHOR_LIST_STATUS,
				payload: { authorStatus: "FAILURE", error: errorMessage(err) },
			});
		}
	};
};

export const getAuthor = (p: { authorId: string }) => {
	const { authorId } = p;

	return async (
		dispatch: DispatchType,
		getState: () => ReturnType<typeof store.getState>
	): Promise<void> => {
		try {
			dispatch({
				type: types.SET_AUTHOR_STATUS,
				payload: { authorStatus: "FETCHING", error: null },
			});

			///////////////////////////////

			const { authorList } = getState().author;
			let author;

			if (!arrayIsEmpty(authorList)) {
				author = authorList.find((i: IAuthorDB) => i.id === authorId);
			} else {
				author = await getAuthorDB({ authorId });
			}

			///////////////////////////////

			dispatch({
				type: types.SET_AUTHOR,
				payload: { author, authorStatus: "SUCCESS" },
			});
		} catch (err) {
			console.warn(errorMessage(err));
			dispatch({
				type: types.SET_AUTHOR_STATUS,
				payload: { authorStatus: "FAILURE", error: errorMessage(err) },
			});
		}
	};
};

export const createAuthor = (p: {
	authorCreated: IAuthorDB;
	saveAsPublic?: boolean;
}) => {
	const { authorCreated, saveAsPublic = true } = p;

	return async (dispatch: DispatchType): Promise<void> => {
		try {
			dispatch({
				type: types.CREATE_AUTHOR_STATUS,
				payload: { authorStatus: "FETCHING", error: null },
			});

			authorCreated.id = new Date().getTime().toString();

			await createAuthorDB({ authorCreated });

			dispatch({
				type: types.CREATE_AUTHOR,
				payload: { authorCreated, authorStatus: "SUCCESS" },
			});
		} catch (err) {
			console.warn(errorMessage(err));
			dispatch({
				type: types.CREATE_AUTHOR_STATUS,
				payload: { authorStatus: "FAILURE", error: errorMessage(err) },
			});
		}
	};
};

export const editAuthor = (p: {
	authorEdited: IAuthorDB;
	saveAsPublic?: boolean;
}) => {
	const { authorEdited, saveAsPublic = false } = p;

	return async (dispatch: DispatchType): Promise<void> => {
		try {
			dispatch({
				type: types.EDIT_AUTHOR_STATUS,
				payload: { authorStatus: "FETCHING", error: null },
			});

			await editAuthorDB({ authorEdited });

			dispatch({
				type: types.EDIT_AUTHOR,
				payload: { authorEdited, authorStatus: "SUCCESS" },
			});
		} catch (err) {
			console.warn(errorMessage(err));
			dispatch({
				type: types.EDIT_AUTHOR_STATUS,
				payload: { authorStatus: "FAILURE", error: errorMessage(err) },
			});
		}
	};
};

export const deleteAuthor = (p: {
	authorDeletedId: string;
	saveAsPublic?: boolean;
}) => {
	const { authorDeletedId, saveAsPublic = false } = p;

	return async (dispatch: DispatchType): Promise<void> => {
		try {
			dispatch({
				type: types.DELETE_AUTHOR_STATUS,
				payload: { authorStatus: "FETCHING", error: null },
			});

			deleteAuthorDB({ authorDeletedId });

			dispatch({
				type: types.DELETE_AUTHOR,
				payload: { authorDeletedId, authorStatus: "SUCCESS" },
			});
		} catch (err) {
			console.warn(errorMessage(err));
			dispatch({
				type: types.DELETE_AUTHOR_STATUS,
				payload: { authorStatus: "FAILURE", error: errorMessage(err) },
			});
		}
	};
};

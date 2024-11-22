// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { TRootState } from "../../store.js";
import { FETCH_STATUS } from "../../utils/types.d";
import { objIsEmpty } from "../../utils/generalUtils.js";
import {
	getAuthorListDB,
	getAuthorDB,
	createAuthorDB,
	editAuthorDB,
	deleteAuthorDB,
} from "./services/authorList.js";
import { TAuthorDB } from "./types.d";
import { errorMessage } from "../../utils/errors.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthor, setAuthorList, setAuthorListStatus, setAuthorStatus } from "./reducers.js";

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

export const getAuthorList = createAsyncThunk(
	'author/getAuthorList', async (_, { dispatch }) => {
		// const authorDispatch = createAuthorDispatch(dispatch);
		try {
			dispatch(setAuthorListStatus({ authorStatus: FETCH_STATUS.FETCHING, authorError: null }))

			const authorList = await getAuthorListDB();

			dispatch(setAuthorList({ authorList, authorStatus: FETCH_STATUS.SUCCESS }))
		} catch (err) {
			console.warn(err);
			dispatch(setAuthorListStatus({
				authorStatus: FETCH_STATUS.FAILURE,
				authorError: errorMessage(err),
			}))
		}
	}
)

export const getAuthor = createAsyncThunk<void, 
	{ authorId: string },{ state: TRootState }>(
		'author/getAuthor', async (
		{ authorId }, { getState, dispatch }
	) => {
		try {
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FETCHING, 
				authorError: null
			}))

			///////////////////////////////

			const { authorList } = getState().author;
			let author;

			if (!objIsEmpty(authorList)) {
				author = authorList[authorId];
			} else {
				author = await getAuthorDB({ authorId });
			}

			///////////////////////////////

			dispatch(setAuthor({ author, authorStatus: FETCH_STATUS.SUCCESS }))
		} catch (err) {
			console.warn(err);
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FAILURE,
				authorError: errorMessage(err),
			}));
		}
	}
)

export const createAuthor = createAsyncThunk<void, 
	{ authorCreated: TAuthorDB; saveAsPublic?: boolean; }>(
		'author/createAuthor', async (
		{ authorCreated, saveAsPublic = true }, { dispatch }
	) => {
		try {
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FETCHING, 
				authorError: null
			}))

			authorCreated.id = new Date().getTime().toString();

			await createAuthorDB({ authorCreated });
			
			dispatch(createAuthor({ authorCreated }))
		} catch (err) {
			console.warn(err);
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FAILURE,
				authorError: errorMessage(err),
			}));
		}
	}
)

export const editAuthor = createAsyncThunk<void, 
	{ authorEdited: TAuthorDB; saveAsPublic?: boolean; }>(
		'author/editAuthor', async (
		{ authorEdited, saveAsPublic = false }, { dispatch }
	) => {
		try {
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FETCHING, 
				authorError: null
			}))

			await editAuthorDB({ authorEdited });

			dispatch(editAuthor({ authorEdited }))
		} catch (err) {
			console.warn(err);
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FAILURE,
				authorError: errorMessage(err),
			}));
		}
	}
)

export const deleteAuthor = createAsyncThunk<void, 
	{ authorDeletedId: string; saveAsPublic?: boolean; }>(
		'author/deleteAuthor', async (
		{ authorDeletedId, saveAsPublic = false }, { dispatch }
	) => {
		try {
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FETCHING, 
				authorError: null
			}))

			deleteAuthorDB({ authorDeletedId });

			dispatch(deleteAuthor({ authorDeletedId }))
		} catch (err) {
			console.warn(err);
			dispatch(setAuthorStatus({
				authorStatus: FETCH_STATUS.FAILURE,
				authorError: errorMessage(err),
			}));
		}
	}
)

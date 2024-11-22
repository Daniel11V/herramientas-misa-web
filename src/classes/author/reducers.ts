import { TAuthorDB, TAuthorListDB } from "./types.d";
import { TFetchStatus, FETCH_STATUS } from "../../utils/types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const authorSlice = createSlice({
	name: 'author',
	initialState,
	reducers: {
		resetAuthorStatus: (state) => {
			state.authorStatus = FETCH_STATUS.INITIAL;
			state.authorError = null;
		},
		setAuthorList: (state, action: PayloadAction<{authorList: TAuthorState['authorList'], authorStatus: TAuthorState['authorStatus']}>) => {
			state.authorList = valid(action.payload?.authorList, 'setAuthorList');
			state.authorStatus = valid(action.payload?.authorStatus, 'setAuthorList');
		},
		setAuthorListStatus: (state, action: PayloadAction<{authorError: TAuthorState['authorError'], authorStatus: TAuthorState['authorStatus']}>) => {
			state.authorError = valid(action.payload?.authorError, 'setAuthorListStatus');
			state.authorStatus = valid(action.payload?.authorStatus, 'setAuthorListStatus');
		},
		setAuthor: (state, action: PayloadAction<{author: TAuthorState['author'], authorStatus: TAuthorState['authorStatus']}>) => {
			state.author = valid(action.payload?.author, 'setAuthor');
			state.authorStatus = valid(action.payload?.authorStatus, 'setAuthor');
		},
		setAuthorStatus: (state, action: PayloadAction<{authorError: TAuthorState['authorError'], authorStatus: TAuthorState['authorStatus']}>) => {
			state.authorError = valid(action.payload?.authorError, 'setAuthorStatus');
			state.authorStatus = valid(action.payload?.authorStatus, 'setAuthorStatus');
		},
		createAuthor: (state, action: PayloadAction<{authorCreated: TAuthorState['author']}>) => {
			let authorCreated = valid(action.payload?.authorCreated, 'createAuthor');
			state.authorList[authorCreated.id] = authorCreated;
			state.author = authorCreated;
			state.authorStatus = FETCH_STATUS.SUCCESS;	
		},
		editAuthor: (state, action: PayloadAction<{authorEdited: TAuthorState['author']}>) => {
			let authorEdited = valid(action.payload?.authorEdited, 'editAuthor');
			state.authorList[authorEdited.id] = authorEdited;
			state.author = authorEdited;
			state.authorStatus = FETCH_STATUS.SUCCESS;	
		},
		deleteAuthor: (state, action: PayloadAction<{authorDeletedId: TAuthorDB['id']}>) => {
			let authorDeletedId = valid(action.payload?.authorDeletedId, 'deleteAuthor');
			delete state.authorList[authorDeletedId];
			state.author = defaultAuthor;
			state.authorStatus = FETCH_STATUS.SUCCESS;
		},
	}
});

export const { 
	resetAuthorStatus,
	setAuthorList,
	setAuthorListStatus,
	setAuthor,
	setAuthorStatus,
	createAuthor,
	editAuthor,
	deleteAuthor,
} = authorSlice.actions;
export default authorSlice.reducer;
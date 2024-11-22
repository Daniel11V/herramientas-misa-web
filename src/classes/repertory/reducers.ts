import { TRepertoryId, TRepertoryList, TRepertoryTitles } from "./types.d";
import {
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
} from "../../utils/types.d";
import { TUserId } from "../user/types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const defaultRepertory: TRepertoryTitles = {
	id: "",
	title: "",
	isPrivate: true,
	annotations: "",
	placeTitle: "",
	placeUbication: "",
	isMass: false,
	creator: {
		id: "",
		name: "",
	},
	members: {},
	songSections: [
		{
			name: "",
			songs: [],
		},
	],
};

export type TRepertoryState = {
	repertoryActionStatus: TFetchStatus;
	repertoryError: string | null;

	repertoryListStatus: TSecurityStatus;
	repertoryListUserId: string | null;
	repertoryList: TRepertoryList;

	repertoryStatus: TSecurityStatus;
	repertoryUserId: string | null;
	repertory: TRepertoryTitles;
};

const initialState: TRepertoryState = {
	repertoryActionStatus: FETCH_STATUS.INITIAL,
	repertoryError: null,

	repertoryListStatus: SECURITY_STATUS.INITIAL,
	repertoryListUserId: null,
	repertoryList: {},

	repertoryStatus: SECURITY_STATUS.INITIAL,
	repertoryUserId: null,
	repertory: defaultRepertory,
};

const repertorySlice = createSlice({
	name: 'repertory',
	initialState,
	reducers: {
		resetRepertoryActionStatus: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.INITIAL;
			state.repertoryError = null;
		},
		setRepertoryListStatus: (state, action: PayloadAction<{repertoryListStatus: TRepertoryState['repertoryListStatus']}>) => {
			state.repertoryListStatus = valid(action.payload?.repertoryListStatus, 'setRepertoryListStatus');
		},
		fetchRepertoryList: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.FETCHING;
		},
		fetchRepertoryListSuccess: (state, action: PayloadAction<{repertoryList: TRepertoryState['repertoryList'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			state.repertoryList = valid(action.payload?.repertoryList, 'fetchRepertoryListSuccess');
			state.repertoryListStatus = valid(action.payload?.userId, 'fetchRepertoryListSuccess')
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			state.repertoryListUserId = valid(action.payload?.userId, 'fetchRepertoryListSuccess');		},
		fetchRepertoryListFailure: (state, action: PayloadAction<{error: TRepertoryState['repertoryError'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.FAILURE;
			state.repertoryError = valid(action.payload?.error, 'fetchRepertoryListFailure');
			state.repertoryListStatus = SECURITY_STATUS.FAILURE;
			state.repertoryListUserId = valid(action.payload?.userId, 'fetchRepertoryListFailure');
		},
		setRepertoryStatus: (state, action: PayloadAction<{repertoryStatus: TRepertoryState['repertoryStatus']}>) => {
			state.repertoryStatus = valid(action.payload?.repertoryStatus, 'setRepertoryStatus');
		},
		fetchRepertory: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.FETCHING;
		},
		fetchRepertorySuccess: (state, action: PayloadAction<{repertory: TRepertoryState['repertory'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			state.repertory = valid(action.payload?.repertory, 'fetchRepertorySuccess');
			state.repertoryStatus = valid(action.payload?.userId, 'fetchRepertorySuccess')
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			state.repertoryUserId = valid(action.payload?.userId, 'fetchRepertorySuccess');		},
		fetchRepertoryFailure: (state, action: PayloadAction<{error: TRepertoryState['repertoryError'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.FAILURE;
			state.repertoryError = valid(action.payload?.error, 'fetchRepertoryFailure');
			state.repertoryStatus = SECURITY_STATUS.FAILURE;
		},
		
		createRepertory: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.FETCHING;
		},
		createRepertorySuccess: (state, action: PayloadAction<{repertoryCreated: TRepertoryState['repertory']}>) => {
			// let repertoryCreated = valid(action.payload?.repertoryCreated, 'createRepertorySuccess');
			state.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			// state.repertoryList[repertoryCreated.id] = repertoryCreated;
			state.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			// state.repertory = repertoryCreated;
		},
		createRepertoryFailure: (state, action: PayloadAction<{error: TRepertoryState['repertoryError'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.FAILURE;
			state.repertoryError = valid(action.payload?.error, 'createRepertoryFailure');
		},
		
		editRepertory: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.FETCHING;
		},
		editRepertorySuccess: (state, action: PayloadAction<{repertoryEdited: TRepertoryState['repertory']}>) => {
			// let repertoryEdited = valid(action.payload?.repertoryEdited, 'editRepertorySuccess');
			state.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			// state.repertoryList[repertoryEdited.id] = repertoryEdited;
			state.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			// state.repertory = repertoryEdited;
		},
		editRepertoryFailure: (state, action: PayloadAction<{error: TRepertoryState['repertoryError'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.FAILURE;
			state.repertoryError = valid(action.payload?.error, 'editRepertoryFailure');
		},
		
		deleteRepertory: (state) => {
			state.repertoryActionStatus = FETCH_STATUS.FETCHING;
		},
		deleteRepertorySuccess: (state, action: PayloadAction<{repertoryDeletedId: TRepertoryId}>) => {
			let repertoryDeletedId = valid(action.payload?.repertoryDeletedId, 'deleteRepertorySuccess');
			state.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			delete state.repertoryList[repertoryDeletedId];
			state.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			state.repertory = defaultRepertory;
		},
		deleteRepertoryFailure: (state, action: PayloadAction<{error: TRepertoryState['repertoryError'], userId: TUserId}>) => {
			state.repertoryActionStatus = FETCH_STATUS.FAILURE;
			state.repertoryError = valid(action.payload?.error, 'deleteRepertoryFailure');
		},
	}
});

export const { 
	resetRepertoryActionStatus,
	setRepertoryListStatus,
	fetchRepertoryList,
	fetchRepertoryListSuccess,
	fetchRepertoryListFailure,
	setRepertoryStatus,
	fetchRepertory,
	fetchRepertorySuccess,
	fetchRepertoryFailure,
	createRepertory,
	createRepertorySuccess,
	createRepertoryFailure,
	editRepertory,
	editRepertorySuccess,
	editRepertoryFailure,
	deleteRepertory,
	deleteRepertorySuccess,
	deleteRepertoryFailure,
} = repertorySlice.actions;
export default repertorySlice.reducer;
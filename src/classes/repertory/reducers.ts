import { produce } from "immer";
import { types } from "./actions";
import { TRepertory } from "./types";
import {
	TActionType,
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
} from "../../utils/types";

const defaultRepertory: TRepertory = {
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
	repertoryList: TRepertory[];

	repertoryStatus: TSecurityStatus;
	repertoryUserId: string | null;
	repertory: TRepertory;
};

const initialState: TRepertoryState = {
	repertoryActionStatus: FETCH_STATUS.INITIAL,
	repertoryError: null,

	repertoryListStatus: SECURITY_STATUS.INITIAL,
	repertoryListUserId: null,
	repertoryList: [],

	repertoryStatus: SECURITY_STATUS.INITIAL,
	repertoryUserId: null,
	repertory: defaultRepertory,
};

const RepertoryReducer = (
	state: TRepertoryState = initialState,
	{ type, payload }: TActionType
) => {
	return produce(state, (newState: TRepertoryState) => {
		switch (type) {
			case types.RESET_REPERTORY_ACTION_STATUS:
				newState.repertoryActionStatus = FETCH_STATUS.INITIAL;
				newState.repertoryError = null;
				break;

			case types.SET_REPERTORY_LIST_STATUS:
				newState.repertoryListStatus = payload.repertoryListStatus;
				break;

			case types.FETCH_REPERTORY_LIST:
				newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
				break;
			case types.FETCH_REPERTORY_LIST_SUCCESS:
				newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
				newState.repertoryList = payload.repertoryList;
				newState.repertoryListStatus = payload.userId
					? SECURITY_STATUS.PRIVATE
					: SECURITY_STATUS.PUBLIC;
				newState.repertoryListUserId = payload.userId;
				break;
			case types.FETCH_REPERTORY_LIST_FAILURE:
				newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
				newState.repertoryError = payload.error;
				newState.repertoryListStatus = SECURITY_STATUS.FAILURE;
				newState.repertoryListUserId = payload.userId;
				break;

			case types.SET_REPERTORY_STATUS:
				newState.repertoryStatus = payload.repertoryStatus;
				break;

			case types.FETCH_REPERTORY:
				newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
				break;
			case types.FETCH_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
				newState.repertory = payload.repertory;
				newState.repertoryStatus = payload.userId
					? SECURITY_STATUS.PRIVATE
					: SECURITY_STATUS.PUBLIC;
				newState.repertoryUserId = payload.userId;
				break;
			case types.FETCH_REPERTORY_FAILURE:
				newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
				newState.repertoryError = payload.error;
				newState.repertoryStatus = SECURITY_STATUS.FAILURE;
				break;

			case types.CREATE_REPERTORY:
				newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
				break;
			case types.CREATE_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
				newState.repertoryList.push(payload.repertoryCreated);
				newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				newState.repertory = payload.repertoryCreated;
				break;
			case types.CREATE_REPERTORY_FAILURE:
				newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
				newState.repertoryError = payload.error;
				break;

			case types.EDIT_REPERTORY:
				newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
				break;
			case types.EDIT_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
				newState.repertoryList = state.repertoryList.map((repertory) =>
					repertory.id === payload.repertoryEdited.id
						? payload.repertoryEdited
						: repertory
				);
				newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				newState.repertory = payload.repertoryEdited;
				break;
			case types.EDIT_REPERTORY_FAILURE:
				newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
				newState.repertoryError = payload.error;
				break;

			case types.DELETE_REPERTORY:
				newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
				break;
			case types.DELETE_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
				delete newState.repertoryList[payload.repertoryDeletedId];
				newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				newState.repertory = defaultRepertory;
				break;
			case types.DELETE_REPERTORY_FAILURE:
				newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
				newState.repertoryError = payload.error;
				break;

			default:
				break;
		}
	});
};

export default RepertoryReducer;

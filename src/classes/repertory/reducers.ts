import { produce } from "immer";
import { types } from "./actions";
import { IRepertory } from "./types";
import {
	IActionType,
	IFetchStatusType,
	ISecurityStatusType,
	fetchStatus,
	securityStatus,
} from "../../utils/types";

const defaultRepertory: IRepertory = {
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
	members: [],
	songSections: [
		{
			name: "",
			songs: [],
		},
	],
};

export interface IRepertoryState {
	repertoryActionStatus: IFetchStatusType;
	repertoryError: string | null;

	repertoryListStatus: ISecurityStatusType;
	repertoryListUserId: string | null;
	repertoryList: IRepertory[];

	repertoryStatus: ISecurityStatusType;
	repertoryUserId: string | null;
	repertory: IRepertory;
}

const initialState: IRepertoryState = {
	repertoryActionStatus: fetchStatus.INITIAL,
	repertoryError: null,

	repertoryListStatus: securityStatus.INITIAL,
	repertoryListUserId: null,
	repertoryList: [],

	repertoryStatus: securityStatus.INITIAL,
	repertoryUserId: null,
	repertory: defaultRepertory,
};

const RepertoryReducer = (
	state: IRepertoryState = initialState,
	{ type, payload }: IActionType
) => {
	return produce(state, (newState: IRepertoryState) => {
		switch (type) {
			case types.RESET_REPERTORY_ACTION_STATUS:
				newState.repertoryActionStatus = fetchStatus.INITIAL;
				newState.repertoryError = null;
				break;

			case types.SET_REPERTORY_LIST_STATUS:
				newState.repertoryListStatus = payload.repertoryListStatus;
				break;

			case types.FETCH_REPERTORY_LIST:
				newState.repertoryActionStatus = fetchStatus.FETCHING;
				break;
			case types.FETCH_REPERTORY_LIST_SUCCESS:
				newState.repertoryActionStatus = fetchStatus.SUCCESS;
				newState.repertoryList = payload.repertoryList;
				newState.repertoryListStatus = payload.userId
					? securityStatus.PRIVATE
					: securityStatus.PUBLIC;
				newState.repertoryListUserId = payload.userId;
				break;
			case types.FETCH_REPERTORY_LIST_FAILURE:
				newState.repertoryActionStatus = fetchStatus.FAILURE;
				newState.repertoryError = payload.error;
				newState.repertoryListStatus = securityStatus.FAILURE;
				newState.repertoryListUserId = payload.userId;
				break;

			case types.SET_REPERTORY_STATUS:
				newState.repertoryStatus = payload.repertoryStatus;
				break;

			case types.FETCH_REPERTORY:
				newState.repertoryActionStatus = fetchStatus.FETCHING;
				break;
			case types.FETCH_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = fetchStatus.SUCCESS;
				newState.repertory = payload.repertory;
				newState.repertoryStatus = payload.userId
					? securityStatus.PRIVATE
					: securityStatus.PUBLIC;
				newState.repertoryUserId = payload.userId;
				break;
			case types.FETCH_REPERTORY_FAILURE:
				newState.repertoryActionStatus = fetchStatus.FAILURE;
				newState.repertoryError = payload.error;
				newState.repertoryStatus = securityStatus.FAILURE;
				break;

			case types.CREATE_REPERTORY:
				newState.repertoryActionStatus = fetchStatus.FETCHING;
				break;
			case types.CREATE_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = fetchStatus.SUCCESS;
				newState.repertoryList.push(payload.repertoryCreated);
				newState.repertoryListStatus = securityStatus.SHOULD_UPDATE;
				newState.repertory = payload.repertoryCreated;
				break;
			case types.CREATE_REPERTORY_FAILURE:
				newState.repertoryActionStatus = fetchStatus.FAILURE;
				newState.repertoryError = payload.error;
				break;

			case types.EDIT_REPERTORY:
				newState.repertoryActionStatus = fetchStatus.FETCHING;
				break;
			case types.EDIT_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = fetchStatus.SUCCESS;
				newState.repertoryList = state.repertoryList.map((repertory) =>
					repertory.id === payload.repertoryEdited.id
						? payload.repertoryEdited
						: repertory
				);
				newState.repertoryListStatus = securityStatus.SHOULD_UPDATE;
				newState.repertory = payload.repertoryEdited;
				break;
			case types.EDIT_REPERTORY_FAILURE:
				newState.repertoryActionStatus = fetchStatus.FAILURE;
				newState.repertoryError = payload.error;
				break;

			case types.DELETE_REPERTORY:
				newState.repertoryActionStatus = fetchStatus.FETCHING;
				break;
			case types.DELETE_REPERTORY_SUCCESS:
				newState.repertoryActionStatus = fetchStatus.SUCCESS;
				delete newState.repertoryList[payload.repertoryDeletedId];
				newState.repertoryListStatus = securityStatus.SHOULD_UPDATE;
				newState.repertory = defaultRepertory;
				break;
			case types.DELETE_REPERTORY_FAILURE:
				newState.repertoryActionStatus = fetchStatus.FAILURE;
				newState.repertoryError = payload.error;
				break;

			default:
				break;
		}
	});
};

export default RepertoryReducer;

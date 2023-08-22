import { produce } from "immer";
import { types } from "./actions";
import { TRepertory, TRepertoryId, TRepertoryList } from "./types";
import {
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
} from "../../utils/types";
import { TUserId } from "../user/types";
import { valid } from "../../utils/generalUtils";

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
	repertoryList: TRepertoryList;

	repertoryStatus: TSecurityStatus;
	repertoryUserId: string | null;
	repertory: TRepertory;
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

export type TRepertoryActionType = (typeof types)[keyof typeof types];

export type TRepertoryActionPayload = Partial<TRepertoryState> & {
	userId?: TUserId;
	error?: string | null;
	repertoryCreated?: TRepertory;
	repertoryEdited?: TRepertory;
	repertoryDeletedId?: TRepertoryId;
};

export type TRepertoryAction = {
	type: TRepertoryActionType;
	payload?: TRepertoryActionPayload;
};

const RepertoryReducer = (
	state = initialState,
	{ type, payload }: TRepertoryAction
) => {
	return produce(state, (newState: TRepertoryState): void => {
		if (type === types.RESET_REPERTORY_ACTION_STATUS) {
			newState.repertoryActionStatus = FETCH_STATUS.INITIAL;
			newState.repertoryError = null;
		}
		if (type === types.SET_REPERTORY_LIST_STATUS) {
			newState.repertoryListStatus = valid(payload?.repertoryListStatus, type);
		}

		if (type === types.FETCH_REPERTORY_LIST) {
			newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.FETCH_REPERTORY_LIST_SUCCESS) {
			newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			newState.repertoryList = valid(payload?.repertoryList, type);
			newState.repertoryListStatus = valid(payload?.userId, type)
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			newState.repertoryListUserId = valid(payload?.userId, type);
		}
		if (type === types.FETCH_REPERTORY_LIST_FAILURE) {
			newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
			newState.repertoryError = valid(payload?.error, type);
			newState.repertoryListStatus = SECURITY_STATUS.FAILURE;
			newState.repertoryListUserId = valid(payload?.userId, type);
		}

		if (type === types.SET_REPERTORY_STATUS) {
			newState.repertoryStatus = valid(payload?.repertoryStatus, type);
		}

		if (type === types.FETCH_REPERTORY) {
			newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.FETCH_REPERTORY_SUCCESS) {
			newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			newState.repertory = valid(payload?.repertory, type);
			newState.repertoryStatus = valid(payload?.userId, type)
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			newState.repertoryUserId = valid(payload?.userId, type);
		}
		if (type === types.FETCH_REPERTORY_FAILURE) {
			newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
			newState.repertoryError = valid(payload?.error, type);
			newState.repertoryStatus = SECURITY_STATUS.FAILURE;
		}

		if (type === types.CREATE_REPERTORY) {
			newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.CREATE_REPERTORY_SUCCESS) {
			let repertoryCreated = valid(payload?.repertoryCreated, type);
			newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			newState.repertoryList[repertoryCreated.id] = repertoryCreated;
			newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.repertory = repertoryCreated;
		}
		if (type === types.CREATE_REPERTORY_FAILURE) {
			newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
			newState.repertoryError = valid(payload?.error, type);
		}

		if (type === types.EDIT_REPERTORY) {
			newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.EDIT_REPERTORY_SUCCESS) {
			let repertoryEdited = valid(payload?.repertoryEdited, type);
			newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			newState.repertoryList[repertoryEdited.id] = repertoryEdited;
			newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.repertory = repertoryEdited;
		}
		if (type === types.EDIT_REPERTORY_FAILURE) {
			newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
			newState.repertoryError = valid(payload?.error, type);
		}

		if (type === types.DELETE_REPERTORY) {
			newState.repertoryActionStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.DELETE_REPERTORY_SUCCESS) {
			let repertoryDeletedId = valid(payload?.repertoryDeletedId, type);
			newState.repertoryActionStatus = FETCH_STATUS.SUCCESS;
			delete newState.repertoryList[repertoryDeletedId];
			newState.repertoryListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.repertory = defaultRepertory;
		}
		if (type === types.DELETE_REPERTORY_FAILURE) {
			newState.repertoryActionStatus = FETCH_STATUS.FAILURE;
			newState.repertoryError = valid(payload?.error, type);
		}
	});
};

export type TRepertorySelectedActionPayload = {
	[types.RESET_REPERTORY_ACTION_STATUS]: undefined;
	[types.SET_REPERTORY_LIST_STATUS]: {
		repertoryListStatus: TRepertoryActionPayload["repertoryListStatus"];
	};
	[types.FETCH_REPERTORY_LIST]: undefined;
	[types.FETCH_REPERTORY_LIST_SUCCESS]: {
		repertoryList: TRepertoryActionPayload["repertoryList"];
		userId: TRepertoryActionPayload["userId"];
	};
	[types.FETCH_REPERTORY_LIST_FAILURE]: {
		userId: TRepertoryActionPayload["userId"];
		error: TRepertoryActionPayload["error"];
	};
	[types.SET_REPERTORY_STATUS]: {
		repertoryStatus: TRepertoryActionPayload["repertoryStatus"];
	};
	[types.FETCH_REPERTORY]: undefined;
	[types.FETCH_REPERTORY_SUCCESS]: {
		repertory: TRepertoryActionPayload["repertory"];
		userId: TRepertoryActionPayload["userId"];
	};
	[types.FETCH_REPERTORY_FAILURE]: {
		error: TRepertoryActionPayload["error"];
	};
	[types.CREATE_REPERTORY]: undefined;
	[types.CREATE_REPERTORY_SUCCESS]: {
		repertoryCreated: TRepertoryActionPayload["repertoryCreated"];
	};
	[types.CREATE_REPERTORY_FAILURE]: {
		error: TRepertoryActionPayload["error"];
	};
	[types.EDIT_REPERTORY]: undefined;
	[types.EDIT_REPERTORY_SUCCESS]: {
		repertoryEdited: TRepertoryActionPayload["repertoryEdited"];
	};
	[types.EDIT_REPERTORY_FAILURE]: {
		error: TRepertoryActionPayload["error"];
	};
	[types.DELETE_REPERTORY]: undefined;
	[types.DELETE_REPERTORY_SUCCESS]: {
		repertoryDeletedId: TRepertoryActionPayload["repertoryDeletedId"];
	};
	[types.DELETE_REPERTORY_FAILURE]: {
		error: TRepertoryActionPayload["error"];
	};
};

export default RepertoryReducer;

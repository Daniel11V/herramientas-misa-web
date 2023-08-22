import { produce } from "immer";
import { types } from "./actions";
import { TSong, TSongId, TSongList } from "./types";
import {
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
} from "../../utils/types";
import { TUserId } from "../user/types";
import { valid } from "../../utils/generalUtils";

const defaultSong: TSong = {
	id: "",
	versionGroupId: "",
	isPrivate: true,
	lyricId: "",
	lyricIsPrivate: true,
	title: "",
	lyric: "",
	lyricStart: "",
	creator: {
		id: "",
		name: "",
	},
	author: {
		id: "",
		name: "",
	},
	rating: [],
	tempo: "",
	pulse: "",
	labels: [],
	level: {
		general: 0,
	},
};

export type TSongState = {
	songRequestStatus: TFetchStatus;
	songError: string | null;

	songListStatus: TSecurityStatus;
	songListUserId: string | null;
	songList: TSongList;

	songStatus: TSecurityStatus;
	songUserId: string | null;
	song: TSong;
};

const initialState: TSongState = {
	songRequestStatus: FETCH_STATUS.INITIAL,
	songError: null,

	songListStatus: SECURITY_STATUS.INITIAL,
	songListUserId: null,
	songList: {},

	songStatus: SECURITY_STATUS.INITIAL,
	songUserId: null,
	song: defaultSong,
};

export type TSongActionType = (typeof types)[keyof typeof types];

export type TSongActionPayload = Partial<TSongState> & {
	userId?: TUserId;
	error?: string | null;
	songCreated?: TSong;
	songEdited?: TSong;
	songDeletedId?: TSongId;
};

export type TSongAction = {
	type: TSongActionType;
	payload?: TSongActionPayload;
};

const SongReducer = (state = initialState, { type, payload }: TSongAction) => {
	return produce(state, (newState: TSongState) => {
		if (type === types.RESET_SONG_REQUEST_STATUS) {
			newState.songRequestStatus = FETCH_STATUS.INITIAL;
			newState.songError = null;
		}

		if (type === types.SET_SONG_LIST_STATUS) {
			newState.songListStatus = valid(payload?.songListStatus, type);
		}

		if (type === types.FETCH_SONG_LIST) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.FETCH_SONG_LIST_SUCCESS) {
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			newState.songList = valid(payload?.songList, type);
			newState.songListStatus = valid(payload?.userId, type)
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			newState.songListUserId = valid(payload?.userId, type);
		}
		if (type === types.FETCH_SONG_LIST_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
			newState.songListStatus = SECURITY_STATUS.FAILURE;
			newState.songListUserId = valid(payload?.userId, type);
		}

		if (type === types.SET_SONG_STATUS) {
			newState.songStatus = valid(payload?.songStatus, type);
		}

		if (type === types.FETCH_SONG) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.FETCH_SONG_SUCCESS) {
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			newState.song = valid(payload?.song, type);
			newState.songStatus = valid(payload?.userId, type)
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
			newState.songUserId = valid(payload?.userId, type);
		}
		if (type === types.FETCH_SONG_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
			newState.songStatus = SECURITY_STATUS.FAILURE;
		}

		if (type === types.CREATE_SONG) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.CREATE_SONG_SUCCESS) {
			let songCreated = valid(payload?.songCreated, type);
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			newState.songList[songCreated.id] = songCreated;
			newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.song = songCreated;
		}
		if (type === types.CREATE_SONG_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
		}

		if (type === types.EDIT_SONG) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.EDIT_SONG_SUCCESS) {
			let songEdited = valid(payload?.songEdited, type);
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			newState.songList[songEdited.id] = songEdited;
			newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.song = songEdited;
		}
		if (type === types.EDIT_SONG_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
		}

		if (type === types.PUBLISH_SONG) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.PUBLISH_SONG_SUCCESS) {
			let songCreated = valid(payload?.songCreated, type);
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			newState.songList[songCreated.id] = songCreated;
			newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.song = songCreated;
		}
		if (type === types.PUBLISH_SONG_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
		}

		if (type === types.DELETE_SONG) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.DELETE_SONG_SUCCESS) {
			let songDeletedId = valid(payload?.songDeletedId, type);
			newState.songRequestStatus = FETCH_STATUS.SUCCESS;
			delete newState.songList[songDeletedId];
			newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
			newState.song = defaultSong;
		}
		if (type === types.DELETE_SONG_FAILURE) {
			newState.songRequestStatus = FETCH_STATUS.FAILURE;
			newState.songError = valid(payload?.error, type);
		}
	});
};

export type TSongSelectedActionPayload = {
	[types.RESET_SONG_REQUEST_STATUS]: undefined;

	[types.SET_SONG_LIST_STATUS]: {
		songListStatus: TSongActionPayload["songListStatus"];
	};

	[types.FETCH_SONG_LIST]: undefined;
	[types.FETCH_SONG_LIST_SUCCESS]: {
		songList: TSongActionPayload["songList"];
		userId: TSongActionPayload["userId"];
	};
	[types.FETCH_SONG_LIST_FAILURE]: {
		error: TSongActionPayload["error"];
		userId: TSongActionPayload["userId"];
	};

	[types.SET_SONG_STATUS]: {
		songStatus: TSongActionPayload["songStatus"];
	};

	[types.FETCH_SONG]: undefined;
	[types.FETCH_SONG_SUCCESS]: {
		song: TSongActionPayload["song"];
		userId: TSongActionPayload["userId"];
	};
	[types.FETCH_SONG_FAILURE]: {
		error: TSongActionPayload["error"];
	};

	[types.CREATE_SONG]: undefined;
	[types.CREATE_SONG_SUCCESS]: {
		songCreated: TSongActionPayload["songCreated"];
	};
	[types.CREATE_SONG_FAILURE]: {
		error: TSongActionPayload["error"];
	};

	[types.EDIT_SONG]: undefined;
	[types.EDIT_SONG_SUCCESS]: {
		songEdited: TSongActionPayload["songEdited"];
	};
	[types.EDIT_SONG_FAILURE]: {
		error: TSongActionPayload["error"];
	};

	[types.PUBLISH_SONG]: undefined;
	[types.PUBLISH_SONG_SUCCESS]: {
		songCreated: TSongActionPayload["songCreated"];
	};
	[types.PUBLISH_SONG_FAILURE]: {
		error: TSongActionPayload["error"];
	};
	[types.DELETE_SONG]: undefined;
	[types.DELETE_SONG_SUCCESS]: {
		songDeletedId: TSongActionPayload["songDeletedId"];
	};
	[types.DELETE_SONG_FAILURE]: {
		error: TSongActionPayload["error"];
	};
};

export default SongReducer;

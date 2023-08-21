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
import { Dispatch } from "react";

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

export type TSongAction = {
	type: string;
	payload?: Partial<TSongState> & {
		userId?: TUserId;
		error?: string | null;
		songCreated?: TSong;
		songEdited?: TSong;
		songDeletedId?: TSongId;
	};
};

const SongReducer = (state = initialState, { type, payload }: TSongAction) => {
	return produce(state, (newState: TSongState) => {
		if (type === types.RESET_SONG_REQUEST_STATUS) {
			newState.songRequestStatus = FETCH_STATUS.INITIAL;
			newState.songError = null;
		}

		if (type === types.SET_SONG_LIST_STATUS) {
			if (payload?.songListStatus) {
				newState.songListStatus = payload.songListStatus;
			}
		}

		if (type === types.FETCH_SONG_LIST) {
			newState.songRequestStatus = FETCH_STATUS.FETCHING;
		}
		if (type === types.FETCH_SONG_LIST_SUCCESS) {
			if (payload?.songList && payload?.userId) {
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				newState.songList = payload.songList;
				newState.songListStatus = payload.userId
					? SECURITY_STATUS.PRIVATE
					: SECURITY_STATUS.PUBLIC;
				newState.songListUserId = payload.userId;
			}
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

export type TSongDispatch = Dispatch<TSongAction>;

export default SongReducer;

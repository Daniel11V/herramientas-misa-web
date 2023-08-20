import { produce } from "immer";
import { types } from "./actions";
import { TSong } from "./types";
import {
	TAction,
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
} from "../../utils/types";

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
	songList: TSong[];

	songStatus: TSecurityStatus;
	songUserId: string | null;
	song: TSong;
};

const initialState: TSongState = {
	songRequestStatus: FETCH_STATUS.INITIAL,
	songError: null,

	songListStatus: SECURITY_STATUS.INITIAL,
	songListUserId: null,
	songList: [],

	songStatus: SECURITY_STATUS.INITIAL,
	songUserId: null,
	song: defaultSong,
};

const SongReducer = (
	state: TSongState = initialState,
	{ type, payload }: TAction
) => {
	return produce(state, (newState: TSongState) => {
		switch (type) {
			case types.RESET_SONG_REQUEST_STATUS:
				newState.songRequestStatus = FETCH_STATUS.INITIAL;
				newState.songError = null;
				break;

			case types.SET_SONG_LIST_STATUS:
				newState.songListStatus = payload.songListStatus;
				break;

			case types.FETCH_SONG_LIST:
				newState.songRequestStatus = FETCH_STATUS.FETCHING;
				break;
			case types.FETCH_SONG_LIST_SUCCESS:
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				newState.songList = payload.songList;
				newState.songListStatus = payload.userId
					? SECURITY_STATUS.PRIVATE
					: SECURITY_STATUS.PUBLIC;
				newState.songListUserId = payload.userId;
				break;
			case types.FETCH_SONG_LIST_FAILURE:
				newState.songRequestStatus = FETCH_STATUS.FAILURE;
				newState.songError = payload.error;
				newState.songListStatus = SECURITY_STATUS.FAILURE;
				newState.songListUserId = payload.userId;
				break;

			case types.SET_SONG_STATUS:
				newState.songStatus = payload.songStatus;
				break;

			case types.FETCH_SONG:
				newState.songRequestStatus = FETCH_STATUS.FETCHING;
				break;
			case types.FETCH_SONG_SUCCESS:
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				newState.song = payload.song;
				newState.songStatus = payload.userId
					? SECURITY_STATUS.PRIVATE
					: SECURITY_STATUS.PUBLIC;
				newState.songUserId = payload.userId;
				break;
			case types.FETCH_SONG_FAILURE:
				newState.songRequestStatus = FETCH_STATUS.FAILURE;
				newState.songError = payload.error;
				newState.songStatus = SECURITY_STATUS.FAILURE;
				break;

			case types.CREATE_SONG:
				newState.songRequestStatus = FETCH_STATUS.FETCHING;
				break;
			case types.CREATE_SONG_SUCCESS:
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				newState.songList.push(payload.songCreated);
				newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				newState.song = payload.songCreated;
				break;
			case types.CREATE_SONG_FAILURE:
				newState.songRequestStatus = FETCH_STATUS.FAILURE;
				newState.songError = payload.error;
				break;

			case types.EDIT_SONG:
				newState.songRequestStatus = FETCH_STATUS.FETCHING;
				break;
			case types.EDIT_SONG_SUCCESS:
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				const indexToEdit = state.songList.findIndex(
					(song) => song.id === payload.songEdited.id
				);
				if (indexToEdit >= 0) {
					newState.songList[indexToEdit] = payload.songEdited;
					newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				}
				newState.song = payload.songEdited;
				break;
			case types.EDIT_SONG_FAILURE:
				newState.songRequestStatus = FETCH_STATUS.FAILURE;
				newState.songError = payload.error;
				break;

			case types.DELETE_SONG:
				newState.songRequestStatus = FETCH_STATUS.FETCHING;
				break;
			case types.DELETE_SONG_SUCCESS:
				newState.songRequestStatus = FETCH_STATUS.SUCCESS;
				delete newState.songList[payload.songDeletedId];
				newState.songListStatus = SECURITY_STATUS.SHOULD_UPDATE;
				newState.song = defaultSong;
				break;
			case types.DELETE_SONG_FAILURE:
				newState.songRequestStatus = FETCH_STATUS.FAILURE;
				newState.songError = payload.error;
				break;

			default:
				break;
		}
	});
};

export default SongReducer;

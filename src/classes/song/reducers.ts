import { produce } from "immer";
import { types } from "./actions";
import { ISong } from "./types";
import {
	IActionType,
	IFetchStatusType,
	ISecurityStatusType,
	fetchStatus,
	securityStatus,
} from "../../utils/types";

const defaultSong: ISong = {
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

export interface ISongState {
	songRequestStatus: IFetchStatusType;
	songError: string | null;

	songListStatus: ISecurityStatusType;
	songListUserId: string | null;
	songList: ISong[];

	songStatus: ISecurityStatusType;
	songUserId: string | null;
	song: ISong;
}

const initialState: ISongState = {
	songRequestStatus: fetchStatus.INITIAL,
	songError: null,

	songListStatus: securityStatus.INITIAL,
	songListUserId: null,
	songList: [],

	songStatus: securityStatus.INITIAL,
	songUserId: null,
	song: defaultSong,
};

const SongReducer = (
	state: ISongState = initialState,
	{ type, payload }: IActionType
) => {
	return produce(state, (newState: ISongState) => {
		switch (type) {
			case types.RESET_SONG_REQUEST_STATUS:
				newState.songRequestStatus = fetchStatus.INITIAL;
				newState.songError = null;
				break;

			case types.SET_SONG_LIST_STATUS:
				newState.songListStatus = payload.songListStatus;
				break;

			case types.FETCH_SONG_LIST:
				newState.songRequestStatus = fetchStatus.FETCHING;
				break;
			case types.FETCH_SONG_LIST_SUCCESS:
				newState.songRequestStatus = fetchStatus.SUCCESS;
				newState.songList = payload.songList;
				newState.songListStatus = payload.userId
					? securityStatus.PRIVATE
					: securityStatus.PUBLIC;
				newState.songListUserId = payload.userId;
				break;
			case types.FETCH_SONG_LIST_FAILURE:
				newState.songRequestStatus = fetchStatus.FAILURE;
				newState.songError = payload.error;
				newState.songListStatus = securityStatus.FAILURE;
				newState.songListUserId = payload.userId;
				break;

			case types.SET_SONG_STATUS:
				newState.songStatus = payload.songStatus;
				break;

			case types.FETCH_SONG:
				newState.songRequestStatus = fetchStatus.FETCHING;
				break;
			case types.FETCH_SONG_SUCCESS:
				newState.songRequestStatus = fetchStatus.SUCCESS;
				newState.song = payload.song;
				newState.songStatus = payload.userId
					? securityStatus.PRIVATE
					: securityStatus.PUBLIC;
				newState.songUserId = payload.userId;
				break;
			case types.FETCH_SONG_FAILURE:
				newState.songRequestStatus = fetchStatus.FAILURE;
				newState.songError = payload.error;
				newState.songStatus = securityStatus.FAILURE;
				break;

			case types.CREATE_SONG:
				newState.songRequestStatus = fetchStatus.FETCHING;
				break;
			case types.CREATE_SONG_SUCCESS:
				newState.songRequestStatus = fetchStatus.SUCCESS;
				newState.songList.push(payload.songCreated);
				newState.songListStatus = securityStatus.SHOULD_UPDATE;
				newState.song = payload.songCreated;
				break;
			case types.CREATE_SONG_FAILURE:
				newState.songRequestStatus = fetchStatus.FAILURE;
				newState.songError = payload.error;
				break;

			case types.EDIT_SONG:
				newState.songRequestStatus = fetchStatus.FETCHING;
				break;
			case types.EDIT_SONG_SUCCESS:
				newState.songRequestStatus = fetchStatus.SUCCESS;
				const indexToEdit = state.songList.findIndex(
					(song) => song.id === payload.songEdited.id
				);
				if (indexToEdit >= 0) {
					newState.songList[indexToEdit] = payload.songEdited;
					newState.songListStatus = securityStatus.SHOULD_UPDATE;
				}
				newState.song = payload.songEdited;
				break;
			case types.EDIT_SONG_FAILURE:
				newState.songRequestStatus = fetchStatus.FAILURE;
				newState.songError = payload.error;
				break;

			case types.DELETE_SONG:
				newState.songRequestStatus = fetchStatus.FETCHING;
				break;
			case types.DELETE_SONG_SUCCESS:
				newState.songRequestStatus = fetchStatus.SUCCESS;
				delete newState.songList[payload.songDeletedId];
				newState.songListStatus = securityStatus.SHOULD_UPDATE;
				newState.song = defaultSong;
				break;
			case types.DELETE_SONG_FAILURE:
				newState.songRequestStatus = fetchStatus.FAILURE;
				newState.songError = payload.error;
				break;

			default:
				break;
		}
	});
};

export default SongReducer;

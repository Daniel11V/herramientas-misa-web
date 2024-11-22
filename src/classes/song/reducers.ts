import { TSong, TSongId, TSongList } from "./types.d";
import {
	TFetchStatus,
	TSecurityStatus,
	FETCH_STATUS,
	SECURITY_STATUS,
	SONG_LIST_TYPE,
	TSongListType,
} from "../../utils/types.d";
import { TUserId } from "../user/types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { getSongList } from "./actions";

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
	songList: TSong[],
	songListStatus: TFetchStatus;
	songListError: string | null,
	songListType: TSongListType;
	
	songRequestStatus: TFetchStatus;
	songError: string | null;

	songListUserId: string | null;

	songStatus: TSecurityStatus;
	songUserId: string | null;
	song: TSong;
};

const initialState: TSongState = {
	songList: [],
	songListStatus: FETCH_STATUS.INITIAL,
	songListError: null,
	songListType: SONG_LIST_TYPE.INITIAL,
	
	songListUserId: null,
	songRequestStatus: FETCH_STATUS.INITIAL,
	songError: null,

	songStatus: SECURITY_STATUS.INITIAL,
	songUserId: null,
	song: defaultSong,
	
};

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
	getSongListLoading: (state) => {
		state.songListStatus = FETCH_STATUS.FETCHING;
		state.songListError = null;
	},
	getSongListSuccess: (state, action: PayloadAction<{songList: TSongState['songList'], userId?: TUserId}>) => {
		state.songListStatus = FETCH_STATUS.SUCCESS;
		state.songListError = null;
		state.songList = valid(action.payload?.songList, 'getSongListSuccess');
		state.songListType = valid(action.payload?.userId, 'getSongListSuccess')
			? SECURITY_STATUS.PRIVATE
			: SECURITY_STATUS.PUBLIC;
		// state.songListUserId = valid(action.payload?.userId, 'getSongListSuccess');    
	},
	getSongListFailure: (state, action: PayloadAction<{error: TSongState['songListError']}>) => {
		state.songListStatus = FETCH_STATUS.FAILURE;
		state.songListError = valid(action.payload?.error, 'getSongListFailure');
		state.songListType = SECURITY_STATUS.FAILURE
		// state.songListUserId = valid(action.payload?.userId, 'getSongListFailure');    
	},
	  
	  
    resetSongRequestStatus: (state) => {
		state.songRequestStatus = FETCH_STATUS.INITIAL;
		state.songError = null;
    },
    setSongListStatus: (state, action: PayloadAction<{songListType: TSongState['songListType']}>) => {
		state.songListType = valid(action.payload?.songListType, 'setSongListStatus');
    },
    setSongStatus: (state, action: PayloadAction<{songStatus: TSongState['songStatus']}>) => {
		state.songStatus = valid(action.payload?.songStatus, 'setSongStatus');
    },
    fetchSongLoading: (state) => {
		state.songRequestStatus = FETCH_STATUS.FETCHING
    },
    fetchSongSuccess: (state, action: PayloadAction<{song: TSongState['song'], userId?: TUserId}>) => {
		state.songRequestStatus = FETCH_STATUS.SUCCESS
		state.song = valid(action.payload?.song, 'fetchSongSuccess');
		state.songStatus = valid(action.payload?.userId, 'fetchSongSuccess')
				? SECURITY_STATUS.PRIVATE
				: SECURITY_STATUS.PUBLIC;
		state.songUserId = valid(action.payload?.userId, 'fetchSongSuccess');
    },
    fetchSongFailure: (state, action: PayloadAction<{error: TSongState['songError']}>) => {
		state.songRequestStatus = FETCH_STATUS.FAILURE
		state.songError = valid(action.payload?.error, 'fetchSongFailure');
		state.songStatus = SECURITY_STATUS.FAILURE;
    },
    createSongLoading: (state) => {
		state.songRequestStatus = FETCH_STATUS.FETCHING;
    },
    createSongSuccess: (state, action: PayloadAction<{songCreated: TSongState['song']}>) => {
		let songCreated = valid(action.payload?.songCreated, 'createSongSuccess');
		state.songRequestStatus = FETCH_STATUS.SUCCESS;
		state.songListType = SECURITY_STATUS.SHOULD_UPDATE;
		state.song = songCreated;
    },
	createSongFailure: (state, action: PayloadAction<{error: TSongState['songError']}>) => {
		state.songRequestStatus = FETCH_STATUS.FAILURE
		state.songError = valid(action.payload?.error, 'createSongFailure');
    },
    editSongLoading: (state) => {
		state.songRequestStatus = FETCH_STATUS.FETCHING;
    },
    editSongSuccess: (state, action: PayloadAction<{songEdited: TSongState['song']}>) => {
		let songEdited = valid(action.payload?.songEdited, 'editSongSuccess');
		state.songRequestStatus = FETCH_STATUS.SUCCESS;
		state.songListType = SECURITY_STATUS.SHOULD_UPDATE;
		state.song = songEdited;
    },
	editSongFailure: (state, action: PayloadAction<{error: TSongState['songError']}>) => {
		state.songRequestStatus = FETCH_STATUS.FAILURE
		state.songError = valid(action.payload?.error, 'editSongFailure');
    },
    publishSongLoading: (state) => {
		state.songRequestStatus = FETCH_STATUS.FETCHING;
    },
    publishSongSuccess: (state, action: PayloadAction<{songCreated: TSongState['song']}>) => {
		let songCreated = valid(action.payload?.songCreated, 'publishSongSuccess');
		state.songRequestStatus = FETCH_STATUS.SUCCESS;
		state.songListType = SECURITY_STATUS.SHOULD_UPDATE;
		state.song = songCreated;
    },
	publishSongFailure: (state, action: PayloadAction<{error: TSongState['songError']}>) => {
		state.songRequestStatus = FETCH_STATUS.FAILURE
		state.songError = valid(action.payload?.error, 'publishSongFailure');
    },
    deleteSongLoading: (state) => {
		state.songRequestStatus = FETCH_STATUS.FETCHING;
    },
    deleteSongSuccess: (state, action: PayloadAction<{songDeletedId: TSongId}>) => {
		let songDeletedId = valid(action.payload?.songDeletedId, 'deleteSongSuccess');
		state.songRequestStatus = FETCH_STATUS.SUCCESS;
		const newSongList = [...state.songList]
		const songIndex = newSongList.findIndex( s => s.id === songDeletedId );
		if (songIndex) newSongList.splice( songIndex, 1 );
		state.songList = newSongList
		state.songListType = SECURITY_STATUS.SHOULD_UPDATE;
		state.song = defaultSong;
    },
	deleteSongFailure: (state, action: PayloadAction<{error: TSongState['songError']}>) => {
		state.songRequestStatus = FETCH_STATUS.FAILURE
		state.songError = valid(action.payload?.error, 'deleteSongFailure');
    },
  },
//   extraReducers: (builder) => {
// 	builder
// 		.addCase(getSongList.pending, (state) => {
// 			state.songRequestStatus = FETCH_STATUS.FETCHING;
// 		})
// 		.addCase(getSongList.fulfilled, (state, action) => {
// 			state.songRequestStatus = FETCH_STATUS.SUCCESS;
// 			state.songList = valid(action.payload?.songList, 'getSongListSuccess');
// 			state.songListType = valid(action.payload?.userId, 'getSongListSuccess')
// 				? SECURITY_STATUS.PRIVATE
// 				: SECURITY_STATUS.PUBLIC;
// 			state.songListUserId = valid(action.payload?.userId, 'getSongListSuccess');    
// 		})
// 		.addCase(getSongList.rejected, (state, action) => {
// 		})
//   }
});

export const { 
	resetSongRequestStatus,
	setSongListStatus,
	getSongListLoading,
	getSongListSuccess,
	getSongListFailure,
	setSongStatus,
	fetchSongLoading,
	fetchSongSuccess,
	fetchSongFailure,
	createSongLoading,
	createSongSuccess,
	createSongFailure,
	editSongLoading,
	editSongSuccess,
	editSongFailure,
	publishSongLoading,
	publishSongSuccess,
	publishSongFailure,
	deleteSongLoading,
	deleteSongSuccess,
	deleteSongFailure,
} = songSlice.actions;
export default songSlice.reducer;
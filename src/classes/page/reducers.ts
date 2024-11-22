import { TSong, TSongId, TSongOptions } from "../song/types.d";
import { TRepertory, TRepertoryId } from "../repertory/types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TPageState {
	songPageBackup: TSongOptions & {
		songList?: Record<TSongId, TSong>;
	};
	songListPageBackup: {
		songList: TSong[];
		filters?: object;
	};
	repertoryPageBackup: {
		repertoryList: Record<TRepertoryId, TRepertory>;
	};
	repertoryListPageBackup: {
		repertoryList: TRepertory[];
	};
	libraryPageBackup: {
		songList: TSong[];
		repertoryList: TRepertory[];
	};
}

const initialState: TPageState = {
	songPageBackup: {
		songList: {},
		tone: undefined,
		annotations: undefined,
		level: undefined,
	},
	songListPageBackup: {
		songList: [],
		filters: {},
	},
	repertoryPageBackup: {
		repertoryList: {},
	},
	repertoryListPageBackup: {
		repertoryList: [],
	},
	libraryPageBackup: {
		songList: [],
		repertoryList: [],
	},
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setSongPageBackup: (state, action: PayloadAction<{songPageBackup: TPageState['songPageBackup']}>) => {
		let songPageBackup = valid(action.payload?.songPageBackup, 'setSongPageBackup');
		state.songPageBackup = {
			...state.songPageBackup,
			...songPageBackup,
		};
    },
    setSongPageBackupSong: (state, action: PayloadAction<{song: TSong}>) => {
		let song = valid(action.payload?.song, 'setSongPageBackupSong');
		state.songPageBackup.songList = {
			...(state.songPageBackup.songList ?? {}),
			[song?.id]: song
		};
    },
    setSongListPageBackup: (state, action: PayloadAction<{songListPageBackup: TPageState['songListPageBackup']}>) => {
		const songListPageBackup = valid(action.payload?.songListPageBackup, 'setSongListPageBackup');
		state.songListPageBackup = {
			...state.songListPageBackup,
			...songListPageBackup
		}
    },
    setRepertoryPageBackup: (state, action: PayloadAction<{repertoryPageBackup: TPageState['repertoryPageBackup']}>) => {
		state.repertoryPageBackup = valid(action.payload?.repertoryPageBackup, 'setRepertoryPageBackup');
		// state.repertoryPageBackup.repertoryList[
		// 	payload.repertoryPageBackup?.id
		// ] = payload.repertoryPageBackup;
    },
    setRepertoryListPageBackup: (state, action: PayloadAction<{repertoryListPageBackup: TPageState['repertoryListPageBackup']}>) => {
		state.repertoryListPageBackup = valid(action.payload?.repertoryListPageBackup, 'setRepertoryListPageBackup');
    },
    setLibraryPageBackup: (state, action: PayloadAction<{libraryPageBackup: TPageState['libraryPageBackup']}>) => {
		state.libraryPageBackup = valid(action.payload?.libraryPageBackup, 'setLibraryPageBackup');
    },
  },
});

export const { 
	setSongPageBackup, 
	setSongPageBackupSong, 
	setSongListPageBackup, 
	setRepertoryPageBackup, 
	setRepertoryListPageBackup, 
	setLibraryPageBackup 
} = pageSlice.actions;
export default pageSlice.reducer;
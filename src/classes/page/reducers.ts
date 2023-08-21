import { produce } from "immer";
import { types } from "./actions";
import { TSong, TSongId, TSongOptions } from "../song/types";
import { TRepertory, TRepertoryId } from "../repertory/types";
import { valid } from "../../utils/generalUtils";

export type TPageState = {
	songPageBackup: TSongOptions & {
		songList: Record<TSongId, TSong>;
	};
	songListPageBackup: {
		songList: TSong[];
		filters: object;
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
};

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

export type TPageAction = {
	type: string;
	payload?: Partial<TPageState> & {
		song?: TSong;
	};
};

const PageReducer = (state = initialState, { type, payload }: TPageAction) => {
	return produce(state, (newState: TPageState) => {
		if (type === types.SET_SONG_PAGE_BACKUP) {
			let songPageBackup = valid(payload?.songPageBackup, type);
			newState.songPageBackup = {
				...newState.songPageBackup,
				...songPageBackup,
			};
		}
		if (type === types.SET_SONG_PAGE_BACKUP_SONG) {
			let song = valid(payload?.song, type);
			newState.songPageBackup.songList[song?.id] = song;
		}
		if (type === types.SET_SONG_LIST_PAGE_BACKUP) {
			newState.songListPageBackup = valid(payload?.songListPageBackup, type);
		}
		if (type === types.SET_REPERTORY_PAGE_BACKUP) {
			newState.repertoryPageBackup = valid(payload?.repertoryPageBackup, type);
			// newState.repertoryPageBackup.repertoryList[
			// 	payload.repertoryPageBackup?.id
			// ] = payload.repertoryPageBackup;
		}
		if (type === types.SET_REPERTORY_LIST_PAGE_BACKUP) {
			newState.repertoryListPageBackup = valid(
				payload?.repertoryListPageBackup,
				type
			);
		}
		if (type === types.SET_LIBRARY_PAGE_BACKUP) {
			newState.libraryPageBackup = valid(payload?.libraryPageBackup, type);
		}
	});
};

export default PageReducer;

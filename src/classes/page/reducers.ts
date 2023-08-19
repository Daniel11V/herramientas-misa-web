import { produce } from "immer";
import { types } from "./actions";
import { TActionType } from "../../utils/types";
import { TSong, TSongId, TSongOptions } from "../song/types";
import { TRepertory, TRepertoryId } from "../repertory/types";

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

const PageReducer = (
	state: TPageState = initialState,
	{ type, payload }: TActionType
) => {
	return produce(state, (newState: TPageState) => {
		switch (type) {
			case types.SET_SONG_PAGE_BACKUP:
				newState.songPageBackup = {
					...newState.songPageBackup,
					...payload.songPageBackup,
				};
				break;
			case types.SET_SONG_PAGE_BACKUP_SONG:
				newState.songPageBackup.songList[payload.song?.id] = payload.song;
				break;
			case types.SET_SONG_LIST_PAGE_BACKUP:
				newState.songListPageBackup = payload.songListPageBackup;
				break;
			case types.SET_REPERTORY_PAGE_BACKUP:
				newState.repertoryPageBackup.repertoryList[
					payload.repertoryPageBackup?.id
				] = payload.repertoryPageBackup;
				break;
			case types.SET_REPERTORY_LIST_PAGE_BACKUP:
				newState.repertoryListPageBackup = payload.repertoryListPageBackup;
				break;
			case types.SET_LIBRARY_PAGE_BACKUP:
				newState.libraryPageBackup = payload.libraryPageBackup;
				break;

			default:
				break;
		}
	});
};

export default PageReducer;

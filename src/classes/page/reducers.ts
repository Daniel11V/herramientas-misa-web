import { produce } from "immer";
import { types } from "./actions";
import { IActionType } from "../../utils/types";
import { ISong } from "../song/types";
import { IRepertory } from "../repertory/types";

export interface IPageState {
	songPageBackup: {
		songList: Record<ISong["id"], ISong>;
		tone: ISong["tone"] | null;
		annotations: ISong["annotations"] | null;
		level: ISong["level"] | null;
	};
	songListPageBackup: {
		songList: ISong[];
		filters: object;
	};
	repertoryPageBackup: {
		repertoryList: Record<IRepertory["id"], IRepertory>;
	};
	repertoryListPageBackup: {
		repertoryList: IRepertory[];
	};
	libraryPageBackup: {
		songList: ISong[];
		repertoryList: IRepertory[];
	};
}

const initialState: IPageState = {
	songPageBackup: {
		songList: {},
		tone: null,
		annotations: null,
		level: null,
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
	state: IPageState = initialState,
	{ type, payload }: IActionType
) => {
	return produce(state, (newState: IPageState) => {
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

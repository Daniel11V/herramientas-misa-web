import produce from 'immer';
import { types } from "./types"

const initialState = {
    songPageBackup: {
        songList: {},
    },
    songListPageBackup: {
        songList: [],
        filters: [],
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
    }
}

const PageReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.SET_SONG_PAGE_BACKUP:
                newState.songPageBackup.songList[payload.songPageBackup?.id] = payload.songPageBackup;
                break;
            case types.SET_SONG_LIST_PAGE_BACKUP:
                newState.songListPageBackup = payload.songListPageBackup;
                break;
            case types.SET_REPERTORY_PAGE_BACKUP:
                newState.repertoryPageBackup.repertoryList[payload.repertoryPageBackup?.id] = payload.repertoryPageBackup;
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
}

export default PageReducer
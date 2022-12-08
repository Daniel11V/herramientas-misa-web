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
            case types.SET_LIBRARY_PAGE_BACKUP:
                newState.libraryPageBackup = payload.libraryPageBackup;
                break;

            default:
                break;
        }
    });
}

export default PageReducer
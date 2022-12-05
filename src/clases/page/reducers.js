import { types } from "./types"

const initialState = {
    songPageBackup: {
        songList: [],
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
    switch (type) {
        case types.SET_SONG_PAGE_BACKUP:
            return { ...state, songPageBackup: payload.songPageBackup }
        case types.SET_SONG_LIST_PAGE_BACKUP:
            return { ...state, songListPageBackup: payload.songListPageBackup }
        case types.SET_LIBRARY_PAGE_BACKUP:
            return { ...state, libraryPageBackup: payload.libraryPageBackup }


        default:
            return state
    }
}

export default PageReducer
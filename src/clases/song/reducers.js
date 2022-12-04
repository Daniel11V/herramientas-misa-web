import { types } from "./types"

const defaultSong = {
    id: "0",
    title: "",
    lyric: "",
    chords: {},
    creator: "",
    author: "",
    rating: [],
    tempo: "",
    pulse: "",
    labels: [],
}

const initialState = {
    songActionStatus: "INITIAL",
    songError: null,
    
    songListStatus: "INITIAL",
    songListUserId: null,
    songList: [],
    
    song: defaultSong,
}

const SongReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_SONG_LIST_STATUS:
            return { ...state, songListStatus: payload.songListStatus }
        case types.SET_SONG_LIST_USER_ID:
            return { ...state, songListUserId: payload.songListUserId }
        case types.RESET_SONG_ACTION_STATUS:
            return { ...state, songActionStatus: "INITIAL", songError: null }

        case types.FETCH_SONG_LIST:
            return { ...state, songActionStatus: "FETCHING" }
        case types.FETCH_SONG_LIST_SUCCESS:
            return { ...state, songActionStatus: "SUCCESS", songList: payload.songList, songListStatus: payload.userId ? "PRIVATE" : "PUBLIC", songListUserId: payload.userId }
        case types.FETCH_SONG_LIST_FAILURE:
            return { ...state, songActionStatus: "FAILURE", songError: payload.error, songListStatus: "FAILURE" }

        case types.FETCH_SONG:
            return { ...state, songActionStatus: "FETCHING" }
        case types.FETCH_SONG_SUCCESS:
            return { ...state, songActionStatus: "SUCCESS", song: payload.song }
        case types.FETCH_SONG_FAILURE:
            return { ...state, songActionStatus: "FAILURE", songError: payload.error }

        case types.CREATE_SONG:
            return { ...state, songActionStatus: "FETCHING" }
        case types.CREATE_SONG_SUCCESS:
            return {
                ...state,
                songActionStatus: "SUCCESS",
                songList: [...state.songList, payload.songCreated],
                songListStatus: "SHOULD_UPDATE",
                song: { ...payload.songCreated }
            }
        case types.CREATE_SONG_FAILURE:
            return { ...state, songActionStatus: "FAILURE", songError: payload.error }

        case types.EDIT_SONG:
            return { ...state, songActionStatus: "FETCHING" }
        case types.EDIT_SONG_SUCCESS:
            return {
                ...state,
                songActionStatus: "SUCCESS",
                songList: state.songList.map(song => song.id === payload.songEdited.id ? payload.songEdited : song),
                songListStatus: "SHOULD_UPDATE",
                song: { ...payload.songEdited }
            }
        case types.EDIT_SONG_FAILURE:
            return { ...state, songActionStatus: "FAILURE", songError: payload.error }

        case types.DELETE_SONG:
            return { ...state, songActionStatus: "FETCHING" }
        case types.DELETE_SONG_SUCCESS:
            let newSongList = [...state.songList];
            delete newSongList[payload.songDeletedId];
            return {
                ...state,
                songActionStatus: "SUCCESS",
                songList: state.songList.filter(song => song.id !== payload.songEdited.id),
                songListStatus: "SHOULD_UPDATE",
                song: defaultSong,
            }
        case types.DELETE_SONG_FAILURE:
            return { ...state, songActionStatus: "FAILURE", songError: payload.error }

        default:
            return state
    }
}

export default SongReducer
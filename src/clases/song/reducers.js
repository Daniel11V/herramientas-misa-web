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
    songStatus: "INITIAL",
    songError: null,

    songList: [],
    song: defaultSong,

    versionGroups: {},
}

const SongReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.RESET_SONG_STATUS:
            return { ...state, songStatus: "INITIAL", songError: null }

        case types.FETCH_SONG_LIST:
            return { ...state, songStatus: "FETCHING" }
        case types.FETCH_SONG_LIST_SUCCESS:
            return { ...state, songStatus: "SUCCESS", songList: payload.songList }
        case types.FETCH_SONG_LIST_FAILURE:
            return { ...state, songStatus: "FAILURE", songError: payload.error }

        case types.FETCH_SONG:
            return { ...state, songStatus: "FETCHING" }
        case types.FETCH_SONG_SUCCESS:
            return { ...state, songStatus: "SUCCESS", song: payload.song }
        case types.FETCH_SONG_FAILURE:
            return { ...state, songStatus: "FAILURE", songError: payload.error }

        case types.CREATE_SONG:
            return { ...state, songStatus: "FETCHING" }
        case types.CREATE_SONG_SUCCESS:
            return {
                ...state,
                songStatus: "SUCCESS",
                songList: [...state.songList, payload.songCreated],
                song: { ...payload.songCreated }
            }
        case types.CREATE_SONG_FAILURE:
            return { ...state, songStatus: "FAILURE", songError: payload.error }

        case types.EDIT_SONG:
            return { ...state, songStatus: "FETCHING" }
        case types.EDIT_SONG_SUCCESS:
            return {
                ...state,
                songStatus: "SUCCESS",
                songList: state.songList.map(song => song.id === payload.songEdited.id ? payload.songEdited : song),
                song: { ...payload.songEdited }
            }
        case types.EDIT_SONG_FAILURE:
            return { ...state, songStatus: "FAILURE", songError: payload.error }

        case types.DELETE_SONG:
            return { ...state, songStatus: "FETCHING" }
        case types.DELETE_SONG_SUCCESS:
            let newSongList = [...state.songList];
            delete newSongList[payload.songDeletedId];
            return {
                ...state,
                songStatus: "SUCCESS",
                songList: state.songList.filter(song => song.id !== payload.songEdited.id),
                song: defaultSong,
            }
        case types.DELETE_SONG_FAILURE:
            return { ...state, songStatus: "FAILURE", songError: payload.error }


        case types.SET_VERSION_GROUPS:
            return { ...state, versionGroups: payload.versionGroups }


        default:
            return state
    }
}

export default SongReducer
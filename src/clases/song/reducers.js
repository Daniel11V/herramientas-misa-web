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
    error: null,

    songListStatus: "INITIAL",
    songList: [],

    songStatus: "INITIAL",
    song: defaultSong,

    versionGroups: {},
}

const SongReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_SONG_LIST:
            return { ...state, songList: payload.songList, songListStatus: payload.songListStatus }
        case types.SET_SONG_LIST_STATUS:
            return { ...state, songListStatus: payload.songListStatus, error: payload.error }

        case types.SET_SONG:
            return { ...state, song: { ...payload.song }, songStatus: payload.songStatus }
        case types.SET_SONG_STATUS:
            return { ...state, songStatus: payload.songStatus, error: payload.error }

        case types.CREATE_SONG:
            return {
                ...state, songList: {
                    ...state.songList,
                    [payload.songCreated.id]: payload.songCreated
                },
                song: { ...payload.songCreated }
            }
        case types.EDIT_SONG:
            return {
                ...state, songList: {
                    ...state.songList,
                    [payload.songEdited.id]: payload.songEdited
                },
                song: { ...payload.songEdited }
            }
        case types.DELETE_SONG:
            let newSongList = { ...state.songList };
            delete newSongList[payload.songDeletedId];
            return {
                ...state, songList: newSongList,
                song: defaultSong,
            }

        case types.SET_VERSION_GROUPS:
            return { ...state, versionGroups: payload.versionGroups }

        default:
            return state
    }
}

export default SongReducer
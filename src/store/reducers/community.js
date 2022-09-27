import { types } from "../actions/community"

const initialState = {
    laoding: false,
    errorFetching: false,

    allSongs: {},
    allSongTitles: {},

    allRepertories: {},
    allRepertoryTitles: {},

    currentSong: {
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
}

const CommunityReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_LOADING:
            return { ...state, loading: payload.loading }

        case types.SET_ALL_SONG_TITLES:
            return { ...state, allSongTitles: payload.allSongTitles }
        case types.SET_ALL_SONGS:
            return { ...state, allSongs: payload.allSongs }

        case types.SET_ALL_REPERTORY_TITLES:
            return { ...state, allRepertoryTitles: payload.allRepertoryTitles }
        case types.SET_ALL_REPERTORIES:
            return { ...state, allRepertories: payload.allRepertories }

        case types.SET_CURRENT_SONG:
            return { ...state, currentSong: { ...payload.song } }

        case types.EDIT_CURRENT_SONG:
            return { ...state, currentSong: { ...payload.songEdited } }

        default:
            return state
    }
}

export default CommunityReducer
import { types } from "../actions/community"

const initialState = {
    laoding: false,
    error: null,

    publicSongTitlesStatus: "INITIAL",
    publicSongTitles: {},
    // publicSongDetails: {},

    privateSongTitlesStatus: "INITIAL",
    privateSongTitles: {},
    // privateSongDetails: {},

    publicRepertoryTitlesStatus: "INITIAL",
    publicRepertoryTitles: {},
    // publicRepertoryDetails: {},

    currentSongStatus: "INITIAL",
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
    },

    myLibrarySongTitles: {

    },
}

const CommunityReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_LOADING:
            return { ...state, loading: payload.loading }

        case types.SET_PUBLIC_SONG_TITLES:
            return { ...state, publicSongTitles: payload.publicSongTitles, publicSongTitlesStatus: payload.publicSongTitlesStatus }
        // case types.SET_PUBLIC_SONG_DETAILS:
        //     return { ...state, publicSongDetails: payload.publicSongDetails }

        case types.SET_PRIVATE_SONG_TITLES:
            return { ...state, privateSongTitles: payload.privateSongTitles }
        // case types.SET_PRIVATE_SONG_DETAILS:
        //     return { ...state, privateSongDetails: payload.privateSongDetails }

        case types.SET_PUBLIC_REPERTORY_TITLES:
            return { ...state, publicRepertoryTitles: payload.publicRepertoryTitles }
        // case types.SET_PUBLIC_REPERTORY_DETAILS:
        //     return { ...state, publicRepertoryDetails: payload.publicRepertoryDetails }

        case types.SET_CURRENT_SONG:
            return { ...state, currentSong: { ...payload.song } }

        case types.EDIT_CURRENT_SONG:
            return { ...state, currentSong: { ...payload.songEdited } }

        default:
            return state
    }
}

export default CommunityReducer
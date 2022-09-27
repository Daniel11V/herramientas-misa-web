import { types } from "../actions/user"

const initialState = {
    loading: false,

    isLogged: false,
    google: {
        id: '0',
        name: '',
        imageUrl: '',
        email: '',
        accessToken: '',
    },
    config: {

    },
    songs: {

    },
    songTitles: {

    },



}

const UserReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_LOADING:
            return { ...state, loading: payload.loading }

        case types.LOGIN:
            return { ...state, google: payload.googleInfo, isLogged: true }
        case types.LOGOUT:
            return { ...initialState }

        case types.SET_USER_SONG_TITLES:
            return { ...state, songTitles: payload.newUserSongTitles }
        case types.SET_USER_SONGS:
            return { ...state, songs: payload.newUserSongs }

        default:
            return state
    }
}

export default UserReducer
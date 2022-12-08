import produce from 'immer';
import { types } from "./types"

const initialState = {
    loading: false,
    error: null,

    isLogged: false, // PREDEPLOY
    // isLogged: true,
    google: {
        id: '',      // PREDEPLOY
        name: '',    // PREDEPLOY
        // id: '111418653738749034139',
        // name: 'Daniel Vinet',
        imageUrl: '',
        email: '',
        accessToken: '',
    },
    config: {
        songPageOptions: {
            fontSize: '16',
            showChords: true,
        }
    },

    isDesktop: null,
}

const UserReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.SET_USER_LOADING:
                newState.loading = payload.loading;
                break;

            case types.LOGIN:
                newState.google = payload.googleInfo;
                newState.isLogged = true;
                newState.loading = false;
                break;
            case types.LOGOUT:
                newState.google = initialState.google;
                newState.loading = false;
                newState.error = null;
                newState.isLogged = false;
                break;

            case types.SET_DEVICE:
                newState.isDesktop = payload.isDesktop;
                break;

            case types.SET_USER_SONG_PAGE_OPTIONS:
                newState.config.songPageOptions = payload.songPageOptions;
                break;

            default:
                return state
        }
    });
}

export default UserReducer
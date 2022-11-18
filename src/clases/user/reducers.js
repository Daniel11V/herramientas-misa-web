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

    },

    isDesktop: null,
}

const UserReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_USER_LOADING:
            return { ...state, loading: payload.loading }

        case types.LOGIN:
            return { ...state, google: payload.googleInfo, isLogged: true, loading: false }
        case types.LOGOUT:
            return {
                ...state, google: initialState.google, loading: false,
                error: null, isLogged: false
            }


        case types.SET_DEVICE:
            return { ...state, isDesktop: payload.isDesktop }

        default:
            return state
    }
}

export default UserReducer
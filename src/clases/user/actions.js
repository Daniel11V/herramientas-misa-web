// import { database } from "../../data/database.js";
import { types } from "./types.js";

export const setUserLoading = (loading) => ({
    type: types.SET_USER_LOADING,
    payload: { loading }
})

export const login = (googleInfo) => ({
    type: types.LOGIN,
    payload: { googleInfo }
})

export const logout = () => ({
    type: types.LOGOUT,
})


export const setDevice = (isDesktop) => ({
    type: types.SET_DEVICE,
    payload: { isDesktop }
})




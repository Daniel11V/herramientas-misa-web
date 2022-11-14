// import { database } from "../../data/database.js";
import { types } from "./types.js";

export const setLoading = (isLoading) => ({
    type: types.SET_LOADING,
    payload: { isLoading }
})

export const login = (googleInfo) => ({
    type: types.LOGIN,
    payload: { googleInfo }
})

export const logout = () => ({
    type: types.LOGOUT,
})

// Thunks

export const getUserSongTitles = (userId) => {
    return async (dispatch, getState) => {
        try {
            const newUserSongTitles = getState().database.userList[userId]?.songTitles || {};

            dispatch({
                type: types.SET_USER_SONG_TITLES,
                payload: { newUserSongTitles }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getUserSongs = (userId) => {
    return async (dispatch, getState) => {
        try {
            const newUserSongs = getState().database.userList[userId]?.songs || {};
            dispatch({
                type: types.SET_USER_SONGS,
                payload: { newUserSongs }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

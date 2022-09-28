// import { database } from "../../data/database.js";
import { types as dbTypes } from "./database.js"; 


export const types = {
    SET_LOADING: 'SET_LOADING',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_USER_SONG_TITLES: 'SET_USER_SONG_TITLES',
    SET_USER_SONGS: 'SET_USER_SONGS',
}

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
            const newUserSongTitles = getState().database.users[userId]?.songTitles || {};
            
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
            const newUserSongs = getState().database.users[userId]?.songs || {};
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

// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
import { database } from "../../data/database.js";
// import * as FileSystem from 'expo-file-system'

export const types = {
    SET_LOADING: 'SET_LOADING',

    SET_ALL_SONG_TITLES: 'SET_ALL_SONG_TITLES',
    SET_ALL_SONGS: 'SET_ALL_SONGS',

    SET_ALL_SONG_TITLES_FILTER: 'SET_ALL_SONG_TITLES_FILTER',
    SET_ALL_SONGS_FILTER: 'SET_ALL_SONGS_FILTER',

    SET_CURRENT_SONG: 'SET_CURRENT_SONG',

    EDIT_CURRENT_SONG: 'EDIT_CURRENT_SONG',

    SET_ALL_REPERTORY_TITLES: 'SET_ALL_REPERTORY_TITLES',
    SET_ALL_REPERTORIES: 'SET_ALL_REPERTORIES',

    SET_ALL_REPERTORY_TITLES_FILTER: 'SET_ALL_REPERTORY_TITLES_FILTER',
    SET_ALL_REPERTORIES_FILTER: 'SET_ALL_REPERTORIES_FILTER',

    SET_CURRENT_REPERTORY: 'SET_CURRENT_REPERTORY',
}

export const setLoading = (isLoading) => ({
    type: types.SET_LOADING,
    payload: { loading: isLoading }
})

// Thunks

export const getAllSongTitles = () => {
    return async dispatch => {
        try {
            dispatch({
                type: types.SET_ALL_SONG_TITLES,
                payload: { allSongTitles: database.allSongTitles }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getAllSongs = () => {
    return async dispatch => {
        try {
            dispatch({
                type: types.SET_ALL_SONGS,
                payload: { allSongs: database.allSongs }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getSong = (songId) => {
    return async dispatch => {
        try {
            dispatch({
                type: types.SET_CURRENT_SONG,
                payload: { song: database.allSongs[songId] || {} }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const editSong = (songEdited) => {
    return async dispatch => {
        try {
            dispatch({
                type: types.EDIT_CURRENT_SONG,
                payload: { songEdited }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getAllRepertoryTitles = () => {
    return async dispatch => {
        try {
            dispatch({
                type: types.SET_ALL_REPERTORY_TITLES,
                payload: { allRepertoryTitles: database.allRepertoryTitles }
            })
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getAllRepertories = () => {
    return async dispatch => {
        try {
            dispatch({
                type: types.SET_ALL_REPERTORIES,
                payload: { allRepertories: database.allRepertories }
            })
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { types as dbTypes } from "./database.js"; 

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
    return async (dispatch, getState) => {
        try {
            console.log("ACA allSongTitles",getState().database)

            const allSongTitles = getState().database.allSongTitles;

            dispatch({
                type: types.SET_ALL_SONG_TITLES,
                payload: { allSongTitles }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getAllSongs = () => {
    return async (dispatch, getState) => {
        try {
            const allSongs = getState().database.allSongs;

            dispatch({
                type: types.SET_ALL_SONGS,
                payload: { allSongs }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getSong = (songId) => {
    return async (dispatch, getState) => {
        try {
            const song = getState().database.allSongs[songId] || {};

            dispatch({
                type: types.SET_CURRENT_SONG,
                payload: { song }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const editSong = (songEdited) => {
    return async (dispatch, getState) => {
        try {
            const database = getState().database;

            dispatch({
                type: dbTypes.SET_DATABASE,
                payload: { newDatabase: {
                    ...database,

                }}
            })

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
    return async (dispatch, getState) => {
        try {
            const allRepertoryTitles = getState().database.allRepertoryTitles;

            dispatch({
                type: types.SET_ALL_REPERTORY_TITLES,
                payload: { allRepertoryTitles }
            })
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

export const getAllRepertories = () => {
    return async (dispatch, getState) => {
        try {
            const allRepertories = getState().database.allRepertories;

            dispatch({
                type: types.SET_ALL_REPERTORIES,
                payload: { allRepertories }
            })
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

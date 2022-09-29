// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { types as dbTypes } from "./database.js";

export const types = {
    SET_LOADING: 'SET_LOADING',

    SET_PUBLIC_SONG_TITLES: 'SET_PUBLIC_SONG_TITLES',
    // SET_PUBLIC_SONG_DETAILS: 'SET_PUBLIC_SONG_DETAILS',
    SET_PUBLIC_SONG_TITLES_FILTER: 'SET_PUBLIC_SONG_TITLES_FILTER',
    // SET_PUBLIC_SONG_DETAILS_FILTER: 'SET_PUBLIC_SONG_DETAILS_FILTER',

    SET_PRIVATE_SONG_TITLES: 'SET_PRIVATE_SONG_TITLES',
    // SET_PRIVATE_SONG_DETAILS: 'SET_PRIVATE_SONG_DETAILS',
    SET_PRIVATE_SONG_TITLES_FILTER: 'SET_PRIVATE_SONG_TITLES_FILTER',
    // SET_PRIVATE_SONG_DETAILS_FILTER: 'SET_PRIVATE_SONG_DETAILS_FILTER',

    SET_CURRENT_SONG: 'SET_CURRENT_SONG',
    EDIT_CURRENT_SONG: 'EDIT_CURRENT_SONG',

    SET_PUBLIC_REPERTORY_TITLES: 'SET_PUBLIC_REPERTORY_TITLES',
    // SET_PUBLIC_REPERTORY_DETAILS: 'SET_PUBLIC_REPERTORY_DETAILS',

    SET_PUBLIC_REPERTORY_TITLES_FILTER: 'SET_PUBLIC_REPERTORY_TITLES_FILTER',
    // SET_PUBLIC_REPERTORY_DETAILS_FILTER: 'SET_PUBLIC_REPERTORY_DETAILS_FILTER',

    SET_CURRENT_REPERTORY: 'SET_CURRENT_REPERTORY',
}

export const setLoading = (isLoading) => ({
    type: types.SET_LOADING,
    payload: { loading: isLoading }
})

// Thunks

export const getPublicSongTitles = () => {
    return async (dispatch, getState) => {
        try {
            const publicSongTitles = getState().database.publicSongTitles;

            dispatch({
                type: types.SET_PUBLIC_SONG_TITLES,
                payload: { publicSongTitles }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_PUBLIC_SONG_TITLES,
                payload: { publicSongTitles: { error } }
            })
            dispatch(setLoading(false))
        }
    }
}

// export const getPublicSongDetails = () => {
//     return async (dispatch, getState) => {
//         try {
//             const publicSongDetails = getState().database.publicSongDetails;

//             dispatch({
//                 type: types.SET_PUBLIC_SONG_DETAILS,
//                 payload: { publicSongDetails }
//             })
//             dispatch(setLoading(false))
//         } catch (error) {
//             console.warn(error);
//             dispatch(setLoading(false))
//         }
//     }
// }

export const getPrivateSongTitles = (userId) => {
    return async (dispatch, getState) => {
        try {
            // const userId = getState().user.google.id;
            if (userId) {
                const privateSongTitles = Object.values(getState().database.privateSongTitles)
                    .reduce((userPrivateSongTitles, privateSongTitle) =>
                        privateSongTitle.creator.id === userId ?
                            ({ ...userPrivateSongTitles, [privateSongTitle.id]: privateSongTitle })
                            : userPrivateSongTitles,
                        {}) || {};

                dispatch({
                    type: types.SET_PRIVATE_SONG_TITLES,
                    payload: { privateSongTitles }
                })
            }
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_PRIVATE_SONG_TITLES,
                payload: { privateSongTitles: { error } }
            })
            dispatch(setLoading(false))
        }
    }
}

// export const getPrivateSongDetails = () => {
//     return async (dispatch, getState) => {
//         try {
//             const privateSongDetails = getState().database.privateSongDetails;

//             dispatch({
//                 type: types.SET_PRIVATE_SONG_DETAILS,
//                 payload: { privateSongDetails }
//             })
//             dispatch(setLoading(false))
//         } catch (error) {
//             console.warn(error);
//             dispatch(setLoading(false))
//         }
//     }
// }

export const getSong = (songId) => {
    return async (dispatch, getState) => {
        try {
            const community = getState().community;
            let song = {};
            let songLocation;

            if (Object.keys(community.publicSongTitles).includes(songId)) {
                song = { ...community.publicSongTitles[songId] };
                songLocation = "PUBLIC";
            } else if (Object.keys(community.privateSongTitles).includes(songId)) {
                song = { ...community.privateSongTitles[songId] };
                songLocation = "PRIVATE";
            }

            if (songLocation === "PUBLIC") {
                song = { ...song, ...getState().database.publicSongDetails[songId] };
            } if (songLocation === "PRIVATE") {
                song = { ...song, ...getState().database.privateSongDetails[songId] };
            }

            dispatch({
                type: types.SET_CURRENT_SONG,
                payload: { song }
            })
            dispatch(setLoading(false))
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_CURRENT_SONG,
                payload: { song: { error } }
            })
            dispatch(setLoading(false))
        }
    }
}

export const editSong = (songEdited, saveAsPublic = false) => {
    return async (dispatch, getState) => {
        try {
            const database = getState().database;

            dispatch({
                type: dbTypes.SET_DATABASE,
                payload: {
                    newDatabase: {
                        ...database,

                    }
                }
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

export const getPublicRepertoryTitles = () => {
    return async (dispatch, getState) => {
        try {
            const publicRepertoryTitles = getState().database.publicRepertoryTitles;

            dispatch({
                type: types.SET_PUBLIC_REPERTORY_TITLES,
                payload: { publicRepertoryTitles }
            })
        } catch (error) {
            console.warn(error);
            dispatch(setLoading(false))
        }
    }
}

// export const getPublicRepertoryDetails = () => {
//     return async (dispatch, getState) => {
//         try {
//             const publicRepertoryDetails = getState().database.publicRepertoryDetails;

//             dispatch({
//                 type: types.SET_PUBLIC_REPERTORY_DETAILS,
//                 payload: { publicRepertoryDetails }
//             })
//         } catch (error) {
//             console.warn(error);
//             dispatch(setLoading(false))
//         }
//     }
// }

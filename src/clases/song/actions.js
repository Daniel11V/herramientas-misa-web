// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { createPrivateSongDetailsDB, getPrivateSongDetailsListDB } from "./services/privateSongDetailsList.js";
import { createPrivateSongTitleDB, getPrivateSongTitleDB, getPrivateSongTitleListDB } from "./services/privateSongTitleList.js";
import { createPublicSongDetailsDB, getPublicSongDetailsDB } from "./services/publicSongDetailsList.js";
import { createPublicSongTitleDB, getPublicSongTitleDB, getPublicSongTitleListDB } from "./services/publicSongTitleList.js";
import { types } from "./types"


export const resetSongStatus = () => ({
    type: types.RESET_SONG_STATUS
})

export const setVersionGroups = (versionGroups) => ({
    type: types.SET_VERSION_GROUPS,
    payload: { versionGroups }
})

// Thunks

export const getSongList = ({ userId }) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.FETCH_SONG_LIST,
                payload: { userId }
            })
            //////////////////////////////////////

            const publicSongTitleList = await getPublicSongTitleListDB();
            const userPrivateSongTitleList = await getPrivateSongTitleListDB({ userId });

            const songList = [
                ...Object.values(publicSongTitleList || {}),
                ...Object.values(userPrivateSongTitleList || {}),
            ]

            //////////////////////////////////////
            dispatch({
                type: types.FETCH_SONG_LIST_SUCCESS,
                payload: { songList }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.FETCH_SONG_LIST_FAILURE,
                payload: { error: error.message }
            })
        }
    }
}

export const getSong = ({ userId, songId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_SONG,
                payload: { userId, songId }
            })
            //////////////////////////////

            const songList = getState().song.songList;
            let songTitle;

            if (!arrayIsEmpty(songList)) {
                songTitle = songList.find(i => i.id === songId);
            } else {
                songTitle = await getPrivateSongTitleDB({ userId, songId });
                if (!songTitle) songTitle = await getPublicSongTitleDB({ songId });
            }

            if (!songTitle) throw new Error("Song not found (Title).");

            let songDetails = {};
            if (songTitle?.publicDetailsId) {
                songDetails = await getPublicSongDetailsDB({ songId: songTitle?.publicDetailId });
            } else if (songTitle?.isPrivate) {
                songDetails = await getPrivateSongDetailsListDB({ songId });
            } else {
                songDetails = await getPublicSongDetailsDB({ songId });
            }

            if (!songDetails) throw new Error("Song not found (Details).");

            const song = { ...songTitle, ...songDetails }

            //////////////////////////////
            dispatch({
                type: types.FETCH_SONG_SUCCESS,
                payload: { song }
            })
        } catch (error) {
            console.warn(error.message);
            dispatch({
                type: types.FETCH_SONG_FAILURE,
                payload: { error: error.message }
            })
        }
    }
}

export const createSong = (songCreated, saveAsPublic = true) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_SONG,
                payload: { songCreated, saveAsPublic }
            })
            //////////////////////////////////////

            if (saveAsPublic) {
                const res = await createPublicSongTitleDB({ songCreated });
                songCreated.songId = res.id;
                await createPublicSongDetailsDB({ songCreated });
            } else {
                const res = await createPrivateSongTitleDB({ songCreated });
                songCreated.songTitleId = res.id;
                await createPrivateSongDetailsDB({ songCreated });
            }

            //////////////////////////////////////
            dispatch({
                type: types.CREATE_SONG_SUCCESS,
                payload: { songCreated }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.CREATE_SONG_FAILURE,
                payload: { error: error.message }
            })
        }
    }
}

export const editSong = (songEdited, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.EDIT_SONG,
                payload: { songEdited, saveAsPublic }
            })
            //////////////////////////////////////

            if (songEdited.isPrivate) {
                // await editPrivateSongTitleDB({ songEdited });
                // await editPrivateSongDetailsDB({ songEdited });
            } else {
                // await editPublicaSongTitleDB({ songEdited });
                // await editPublicaSongDetailsDB({ songEdited });
            }

            //////////////////////////////////////
            dispatch({
                type: types.EDIT_SONG_SUCCESS,
                payload: { songEdited }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.EDIT_SONG_FAILURE,
                payload: { error: error.message }
            })
        }
    }
}

export const deleteSong = (songDeletedId, isPrivate = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.DELETE_SONG,
                payload: { songDeletedId, isPrivate }
            })
            //////////////////////////////////////

            if (isPrivate) {
                // deletePrivateSongTitleDB({ songDeletedId });
                // deletePrivateSongDetailsDB({ songDeletedId });
            } else {
                // deletePublicSongTitleDB({ songDeletedId });
                // deletePublicSongDetailsDB({ songDeletedId });
            }

            //////////////////////////////////////
            dispatch({
                type: types.DELETE_SONG_SUCCESS,
                payload: { songDeletedId }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.DELETE_SONG_FAILURE,
                payload: { error: error.message }
            })
        }
    }
}

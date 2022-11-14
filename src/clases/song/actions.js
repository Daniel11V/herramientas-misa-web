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

export const setVersionGroups = (versionGroups) => ({
    type: types.SET_VERSION_GROUPS,
    payload: { versionGroups }
})


// Thunks

export const getSongList = ({ userId }) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.SET_SONG_LIST_STATUS,
                payload: { songListStatus: "FETCHING", error: null }
            })

            //////////////////////////////////////

            const publicSongTitleList = await getPublicSongTitleListDB();
            const userPrivateSongTitleList = await getPrivateSongTitleListDB({ userId });

            const songList = [
                ...Object.values(publicSongTitleList),
                ...Object.values(userPrivateSongTitleList),
            ]

            //////////////////////////////////////

            dispatch({
                type: types.SET_SONG_LIST,
                payload: { songList, songListStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_SONG_LIST_STATUS,
                payload: { songListStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const getSong = ({ userId, songId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.SET_SONG_STATUS,
                payload: { songStatus: "FETCHING", error: null }
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
                type: types.SET_SONG,
                payload: { song, songStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error.message);
            dispatch({
                type: types.SET_SONG_STATUS,
                payload: { songStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const createSong = (songCreated, saveAsPublic = true) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_SONG_STATUS,
                payload: { songStatus: "FETCHING", error: null }
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
                type: types.CREATE_SONG,
                payload: { songCreated, songStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.CREATE_SONG_STATUS,
                payload: { songStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const editSong = (songEdited, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.EDIT_SONG_STATUS,
                payload: { songStatus: "FETCHING", error: null }
            })

            if (songEdited.isPrivate) {
                // await editPrivateSongTitleDB({ songEdited });
                // await editPrivateSongDetailsDB({ songEdited });
            } else {
                // await editPublicaSongTitleDB({ songEdited });
                // await editPublicaSongDetailsDB({ songEdited });
            }


            dispatch({
                type: types.EDIT_SONG,
                payload: { songEdited, songStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.EDIT_SONG_STATUS,
                payload: { songStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const deleteSong = (songDeletedId, isPrivate = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.DELETE_SONG_STATUS,
                payload: { songStatus: "FETCHING", error: null }
            })

            if (isPrivate) {
                // deletePrivateSongTitleDB({ songDeletedId });
                // deletePrivateSongDetailsDB({ songDeletedId });
            } else {
                // deletePublicSongTitleDB({ songDeletedId });
                // deletePublicSongDetailsDB({ songDeletedId });
            }

            dispatch({
                type: types.DELETE_SONG,
                payload: { songDeletedId, songStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.DELETE_SONG_STATUS,
                payload: { songStatus: "FAILURE", error: error.message }
            })
        }
    }
}

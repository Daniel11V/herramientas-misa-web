// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { createPrivateSongLyricDB, getPrivateSongLyricListDB } from "./services/privateSongLyricList.js";
import { createPrivateSongTitleDB, getPrivateSongTitleDB, getPrivateSongTitleListDB } from "./services/privateSongTitleList.js";
import { createPublicSongLyricDB, getPublicSongLyricDB } from "./services/publicSongLyricList.js";
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

            let songLyric = {};
            if (songTitle?.publicLyricId) {
                songLyric = await getPublicSongLyricDB({ songId: songTitle?.publicLyricId });
            } else if (songTitle?.isPrivate) {
                songLyric = await getPrivateSongLyricListDB({ songId });
            } else {
                songLyric = await getPublicSongLyricDB({ songId });
            }

            if (!songLyric) throw new Error("Song not found (Lyric).");

            const song = { ...songTitle, ...songLyric }

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

export const createSong = (songCreated, saveAsPublic = false) => {
    // Siempre que se cree una canción por el momento se creará como privada y luego se podra publicar
    // Primero se crea el Lyric y luego el Title, colocando acá el id del Lyric y si es publico o privado.

    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_SONG,
                payload: { songCreated, saveAsPublic }
            })
            //////////////////////////////////////

            const { lyric, ...songTitle } = songCreated;

            const songTitleCreated = {
                isPrivate: true,
                title: songTitle.title,
                author: songTitle.author,
                creator: songTitle.creator,
                labels: songTitle.labels,
                topics: songTitle.topics,
                rating: songTitle.rating,
                description: songTitle.description,
                pulse: songTitle.pulse,
                tempo: songTitle.tempo,
                level: {
                    main: 1,
                },                
            }

            let newSongCreatedByDB;
            if (saveAsPublic) {
                const res = await createPublicSongTitleDB({ songCreated });
                songCreated.songId = res.id;
                await createPublicSongLyricDB({ songCreated });
            } else {
                const newSongLyricCreatedByDB = await createPrivateSongLyricDB({ lyric });
                songTitleCreated.lyricId = newSongLyricCreatedByDB.id;
                songTitleCreated.lyricIsPublic = false;
                const newSongTitleCreatedByDB = await createPrivateSongTitleDB({ songTitleCreated });
                newSongCreatedByDB = {
                    ...newSongTitleCreatedByDB,
                    lyric: newSongLyricCreatedByDB.lyric,
                }
            }

            //////////////////////////////////////
            dispatch({
                type: types.CREATE_SONG_SUCCESS,
                payload: { songCreated: newSongCreatedByDB }
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
                // await editPrivateSongLyricDB({ songEdited });
            } else {
                // await editPublicaSongTitleDB({ songEdited });
                // await editPublicaSongLyricDB({ songEdited });
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
                // deletePrivateSongLyricDB({ songDeletedId });
            } else {
                // deletePublicSongTitleDB({ songDeletedId });
                // deletePublicSongLyricDB({ songDeletedId });
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

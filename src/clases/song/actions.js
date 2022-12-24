// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { createPrivateSongLyricDB, deletePrivateSongLyricDB, editPrivateSongLyricDB, getPrivateSongLyricDB } from "./services/privateSongLyricList.js";
import { createPrivateSongTitleDB, deletePrivateSongTitleDB, editPrivateSongTitleDB, getPrivateSongTitleDB, getPrivateSongTitleListDB } from "./services/privateSongTitleList.js";
import { createPublicSongLyricDB, editPublicSongLyricDB, getPublicSongLyricDB } from "./services/publicSongLyricList.js";
import { createPublicSongTitleDB, editPublicSongTitleDB, getPublicSongTitleDB, getPublicSongTitleListDB } from "./services/publicSongTitleList.js";
import { types } from "./types"


export const resetSongActionStatus = () => ({
    type: types.RESET_SONG_ACTION_STATUS
})
export const setSongListStatus = (songListStatus) => ({
    type: types.SET_SONG_LIST_STATUS,
    payload: { songListStatus }
})
export const setSongStatus = (songStatus) => ({
    type: types.SET_SONG_LIST_STATUS,
    payload: { songStatus }
})

// Thunks

export const getSongList = ({ userId, onlyAddPrivates = false }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_SONG_LIST,
                payload: { userId }
            })
            //////////////////////////////////////
            let publicSongTitleList;
            if (onlyAddPrivates) {
                publicSongTitleList = getState().song.songList.reduce((tO, e) => ({ ...tO, [e.id]: e }), {});
            } else {
                publicSongTitleList = await getPublicSongTitleListDB();
            }
            const userPrivateSongTitleList = await getPrivateSongTitleListDB({ userId });

            const songList = [
                ...Object.values(publicSongTitleList || {}),
                ...Object.values(userPrivateSongTitleList || {}),
            ]

            //////////////////////////////////////
            dispatch({
                type: types.FETCH_SONG_LIST_SUCCESS,
                payload: { songList, userId }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.FETCH_SONG_LIST_FAILURE,
                payload: { error: error.message, userId }
            })
        }
    }
}

export const getSong = ({ userId, songTitleId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_SONG,
                payload: { userId, songTitleId }
            })
            //////////////////////////////

            let songTitle = getState().song.songList.find(i => i.id === songTitleId);
            if (!songTitle) songTitle = await getPrivateSongTitleDB({ userId, songTitleId, hasInvitation: true });
            if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
            if (!songTitle) throw new Error("Song not found (Title).");

            let songLyric = {};
            if (songTitle?.lyricIsPrivate) {
                songLyric = await getPrivateSongLyricDB({ songLyricId: songTitle?.lyricId });
            } else {
                songLyric = await getPublicSongLyricDB({ songLyricId: songTitle?.lyricId });
            }

            if (!songLyric) throw new Error("Song not found (Lyric).");

            const song = { ...songTitle, ...songLyric }

            //////////////////////////////
            dispatch({
                type: types.FETCH_SONG_SUCCESS,
                payload: { song, userId }
            })
        } catch (error) {
            console.warn(error.message);
            dispatch({
                type: types.FETCH_SONG_FAILURE,
                payload: { error: error.message, userId }
            })
        }
    }
}

export const getSongTitle = ({ userId, songTitleId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_SONG_TITLE,
                payload: { userId, songTitleId }
            })
            //////////////////////////////

            let songTitle;
            const { songList } = getState().page.songListPageBackup;
            if (!arrayIsEmpty(songList)) songTitle = songList.find(i => i.id === songTitleId);

            if (!songTitle) {
                const { songList: songPageBackupList } = getState().page.songPageBackup;
                songTitle = songPageBackupList[songTitleId]
            }
            if (!songTitle) songTitle = await getPrivateSongTitleDB({ userId, songTitleId, hasInvitation: true });
            if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
            if (!songTitle) throw new Error("Song not found (Title).");

            //////////////////////////////
            dispatch({
                type: types.FETCH_SONG_TITLE_SUCCESS,
                payload: { songTitle, userId }
            })
        } catch (error) {
            console.warn(error.message);
            dispatch({
                type: types.FETCH_SONG_TITLE_FAILURE,
                payload: { error: error.message, userId }
            })
        }
    }
}

export const createSong = (songCreated) => {
    // Siempre que se cree una canción por el momento se creará como privada y luego se podra publicar
    // Primero se crea el Lyric y luego el Title, colocando acá el id del Lyric y si es publico o privado.

    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_SONG,
                payload: { songCreated }
            })
            //////////////////////////////////////

            const { lyric, ...songTitle } = songCreated;

            const realAuthor = songTitle.author.value === "Other" ? ({ value: "-", label: "Desconocido" }) : songTitle.author;

            const songTitleCreated = {
                isPrivate: true,
                title: songTitle.title,
                author: realAuthor,
                creator: songTitle.creator,
                labels: songTitle.labels,
                topics: songTitle.topics,
                rating: songTitle.rating,
                annotations: songTitle.annotations,
                pulse: songTitle.pulse,
                tempo: songTitle.tempo,
                level: {
                    voice: 0,
                },
            }

            // if (saveAsPublic) {
            //     const res = await createPublicSongTitleDB({ songCreated });
            //     songCreated.songId = res.id;
            //     await createPublicSongLyricDB({ songCreated });

            const newSongLyricCreatedByDB = await createPrivateSongLyricDB({ lyric });
            songTitleCreated.lyricId = newSongLyricCreatedByDB.id;
            songTitleCreated.lyricIsPrivate = true;
            const newSongTitleCreatedByDB = await createPrivateSongTitleDB({ songTitleCreated });
            const newSongCreatedByDB = {
                ...newSongLyricCreatedByDB,
                ...newSongTitleCreatedByDB,
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

            const { lyric, ...songTitleEdited } = songEdited;
            if (songTitleEdited.isPrivate) {
                await editPrivateSongTitleDB({ songTitleEdited });
            } else {
                await editPublicSongTitleDB({ songTitleEdited });
            }

            if (songTitleEdited.lyricIsPrivate) {
                await editPrivateSongLyricDB({ lyricId: songTitleEdited.lyricId, lyric });
            } else {
                await editPublicSongLyricDB({ lyricId: songTitleEdited.lyricId, lyric });
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

export const publishSong = (songPublicId) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.PUBLISH_SONG,
                payload: { songPublicId }
            })
            //////////////////////////////////////


            const oldSongTitleFromDB = await getPrivateSongTitleDB({ songTitleId: songPublicId, hasInvitation: true });
            await deletePrivateSongTitleDB({ songTitleId: songPublicId });
            console.log("ACA", { oldSongTitleFromDB, songPublicId })
            const oldSongLyricFromDB = await getPrivateSongLyricDB({ songLyricId: oldSongTitleFromDB.lyricId });
            await deletePrivateSongLyricDB({ songLyricId: oldSongTitleFromDB.lyricId });

            const newSongLyricCreatedByDB = await createPublicSongLyricDB({ lyric: oldSongLyricFromDB.lyric });
            const newPublicSongTitle = {
                ...oldSongTitleFromDB,
                isPrivate: false,
                lyricIsPrivate: false,
                lyricId: newSongLyricCreatedByDB.id,
            }
            const newSongTitleCreatedByDB = await createPublicSongTitleDB({ songTitleCreated: newPublicSongTitle });
            const newSongCreatedByDB = {
                ...newSongLyricCreatedByDB,
                ...newSongTitleCreatedByDB,
            }

            //////////////////////////////////////
            dispatch({
                type: types.PUBLISH_SONG_SUCCESS,
                payload: { newSongCreatedByDB }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.PUBLISH_SONG_FAILURE,
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

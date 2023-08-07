// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { getPrivateSongTitleDB } from "../song/services/privateSongTitleList.js";
import { getPublicSongTitleDB } from "../song/services/publicSongTitleList.js";
import { getPrivateRepertoryListDB, getPrivateRepertoryDB } from "./services/privateRepertoryList.js";
import { getPublicRepertoryDB, getPublicRepertoryListDB } from "./services/publicRepertoryList.js";
import { types } from "./types"


export const resetRepertoryActionStatus = () => ({
    type: types.RESET_REPERTORY_ACTION_STATUS
})
export const setRepertoryListStatus = (repertoryListStatus) => ({
    type: types.SET_REPERTORY_LIST_STATUS,
    payload: { repertoryListStatus }
})
export const setRepertoryStatus = (repertoryStatus) => ({
    type: types.SET_REPERTORY_STATUS,
    payload: { repertoryStatus }
})

// Thunks

export const getRepertoryList = ({ userId, onlyAddPrivates = false }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_REPERTORY_LIST,
                payload: { userId }
            })
            //////////////////////////////////////
            let publicRepertoryList;
            if (onlyAddPrivates) {
                publicRepertoryList = getState().repertory.repertoryList.reduce((tO, e) => ({ ...tO, [e.id]: e }), {});
            } else {
                publicRepertoryList = await getPublicRepertoryListDB();
            }
            const userPrivateRepertoryList = await getPrivateRepertoryListDB({ userId });

            const repertoryList = [
                ...Object.values(publicRepertoryList || {}),
                ...Object.values(userPrivateRepertoryList || {}),
            ]

            //////////////////////////////////////
            dispatch({
                type: types.FETCH_REPERTORY_LIST_SUCCESS,
                payload: { repertoryList, userId }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.FETCH_REPERTORY_LIST_FAILURE,
                payload: { error: error.message, userId }
            })
        }
    }
}

export const getRepertory = ({ userId, repertoryId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.FETCH_REPERTORY,
                payload: { userId, repertoryId }
            })
            //////////////////////////////

            const repertoryList = getState().repertory.repertoryList;
            let repertory;
            if (!arrayIsEmpty(repertoryList)) repertory = repertoryList.find(i => i.id === repertoryId);

            if (!repertory) repertory = await getPrivateRepertoryDB({ userId, repertoryId, hasInvitation: true });
            if (!repertory) repertory = await getPublicRepertoryDB({ repertoryId });
            if (!repertory) throw new Error("Repertory not found (Title).");

            const returnRepertorySongSections = [];
            for (const [key, section] of repertory?.songSections) {
                returnRepertorySongSections.push({name: section?.name, songs: []});

                for (const songTitleId of section?.songs) {

                    let songTitle = getState().page.songListPageBackup.songList.find(i => i.id === songTitleId);
                    if (!songTitle) songTitle = getState().page.songPageBackup.songList[songTitleId];
                    if (!songTitle) songTitle = await getPrivateSongTitleDB({ userId, songTitleId, hasInvitation: true });
                    if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
                    if (!songTitle) throw new Error("Song not found (Title).");

                    returnRepertorySongSections[key]?.songs?.push(songTitle);
                }
            }
            const returnRepertory = { ...repertory, songSections: returnRepertorySongSections };

            //////////////////////////////
            dispatch({
                type: types.FETCH_REPERTORY_SUCCESS,
                payload: { repertory: returnRepertory, userId }
            })
        } catch (error) {
            console.warn(error.message);
            dispatch({
                type: types.FETCH_REPERTORY_FAILURE,
                payload: { error: error.message, userId }
            })
        }
    }
}
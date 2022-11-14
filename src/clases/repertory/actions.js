// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { getPrivateRepertoryListDB, getPrivateRepertoryDB, createPrivateRepertoryDB, deletePrivateRepertoryDB, editPrivateRepertoryDB } from "./services/privateRepertoryList.js";
import { types } from "./types"


// Thunks

export const getRepertoryList = ({ userId }) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.SET_REPERTORY_LIST_STATUS,
                payload: { repertoryListStatus: "FETCHING", error: null }
            })

            const privateRepertoryListDB = await getPrivateRepertoryListDB({ userId });
            const repertoryList = Object.values(privateRepertoryListDB);

            dispatch({
                type: types.SET_REPERTORY_LIST,
                payload: { repertoryList, repertoryListStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_REPERTORY_LIST_STATUS,
                payload: { repertoryListStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const getRepertory = ({ userId, repertoryId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.SET_REPERTORY_STATUS,
                payload: { repertoryStatus: "FETCHING", error: null }
            })

            ///////////////////////////////

            const repertoryList = getState().repertory.repertoryList;
            let repertory;
            if (!arrayIsEmpty(repertoryList)) {
                repertory = repertoryList.find(i => i.id === repertoryId);
            } else {
                repertory = await getPrivateRepertoryDB({ userId, repertoryId });
            }

            if (!repertory) throw new Error("Repertory not found.");

            ///////////////////////////////

            dispatch({
                type: types.SET_REPERTORY,
                payload: { repertory, repertoryStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_REPERTORY_STATUS,
                payload: { repertoryStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const createRepertory = (repertoryCreated, saveAsPublic = true) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_REPERTORY_STATUS,
                payload: { repertoryStatus: "FETCHING", error: null }
            })

            await createPrivateRepertoryDB({ repertoryCreated, saveAsPublic });

            dispatch({
                type: types.CREATE_REPERTORY,
                payload: { repertoryCreated, repertoryStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.CREATE_REPERTORY_STATUS,
                payload: { repertoryStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const editRepertory = (repertoryEdited, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.EDIT_REPERTORY_STATUS,
                payload: { repertoryStatus: "FETCHING", error: null }
            })

            await editPrivateRepertoryDB({ repertoryEdited, saveAsPublic });

            dispatch({
                type: types.EDIT_REPERTORY,
                payload: { repertoryEdited, repertoryStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.EDIT_REPERTORY_STATUS,
                payload: { repertoryStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const deleteRepertory = (repertoryDeletedId, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.DELETE_REPERTORY_STATUS,
                payload: { repertoryStatus: "FETCHING", error: null }
            })

            deletePrivateRepertoryDB({ repertoryDeletedId, saveAsPublic });

            dispatch({
                type: types.DELETE_REPERTORY,
                payload: { repertoryDeletedId, repertoryStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.DELETE_REPERTORY_STATUS,
                payload: { repertoryStatus: "FAILURE", error: error.message }
            })
        }
    }
}

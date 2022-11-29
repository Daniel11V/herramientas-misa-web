// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { getItemListDB, getItemDB, createItemDB, editItemDB, deleteItemDB } from "./services/itemList.js";
import { types } from "./types"


export const resetItemStatus = () => ({
    type: types.RESET_ITEM_STATUS
})

// Thunks

export const getItemList = ({ userId }) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.SET_ITEM_LIST_STATUS,
                payload: { itemStatus: "FETCHING", error: null }
            })

            const itemList = await getItemListDB({ userId });

            dispatch({
                type: types.SET_ITEM_LIST,
                payload: { itemList, itemStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_ITEM_LIST_STATUS,
                payload: { itemStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const getItem = ({ userId, itemId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.SET_ITEM_STATUS,
                payload: { itemStatus: "FETCHING", error: null }
            })

            ///////////////////////////////

            const { itemList } = getState().item;
            let item;

            if (!arrayIsEmpty(itemList)) {
                item = itemList.find(i => i.id === itemId);
            } else {
                item = await getItemDB({ userId, itemId });
            }

            ///////////////////////////////

            dispatch({
                type: types.SET_ITEM,
                payload: { item, itemStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_ITEM_STATUS,
                payload: { itemStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const createItem = (itemCreated, saveAsPublic = true) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_ITEM_STATUS,
                payload: { itemStatus: "FETCHING", error: null }
            })

            await createItemDB({ itemCreated, saveAsPublic });

            dispatch({
                type: types.CREATE_ITEM,
                payload: { itemCreated, itemStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.CREATE_ITEM_STATUS,
                payload: { itemStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const editItem = (itemEdited, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.EDIT_ITEM_STATUS,
                payload: { itemStatus: "FETCHING", error: null }
            })

            await editItemDB({ itemEdited, saveAsPublic });

            dispatch({
                type: types.EDIT_ITEM,
                payload: { itemEdited, itemStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.EDIT_ITEM_STATUS,
                payload: { itemStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const deleteItem = (itemDeletedId, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.DELETE_ITEM_STATUS,
                payload: { itemStatus: "FETCHING", error: null }
            })

            deleteItemDB({ itemDeletedId, saveAsPublic });

            dispatch({
                type: types.DELETE_ITEM,
                payload: { itemDeletedId, itemStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.DELETE_ITEM_STATUS,
                payload: { itemStatus: "FAILURE", error: error.message }
            })
        }
    }
}

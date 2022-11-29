// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty } from "../../utils.js";
import { getAuthorListDB, getAuthorDB, createAuthorDB, editAuthorDB, deleteAuthorDB } from "./services/authorList.js";
import { types } from "./types"

export const resetAuthorStatus = () => ({
    type: types.RESET_AUTHOR_STATUS
})

// Thunks

export const getAuthorList = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.SET_AUTHOR_LIST_STATUS,
                payload: { authorStatus: "FETCHING", error: null }
            })

            const authorListObject = await getAuthorListDB();
            const authorList = Object.values(authorListObject || {});

            dispatch({
                type: types.SET_AUTHOR_LIST,
                payload: { authorList, authorStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_AUTHOR_LIST_STATUS,
                payload: { authorStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const getAuthor = ({ authorId }) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: types.SET_AUTHOR_STATUS,
                payload: { authorStatus: "FETCHING", error: null }
            })

            ///////////////////////////////

            const { authorList } = getState().author;
            let author;

            if (!arrayIsEmpty(authorList)) {
                author = authorList.find(i => i.id === authorId);
            } else {
                author = await getAuthorDB({ authorId });
            }

            ///////////////////////////////

            dispatch({
                type: types.SET_AUTHOR,
                payload: { author, authorStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.SET_AUTHOR_STATUS,
                payload: { authorStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const createAuthor = (authorCreated, saveAsPublic = true) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.CREATE_AUTHOR_STATUS,
                payload: { authorStatus: "FETCHING", error: null }
            })

            authorCreated.id = new Date().getTime().toString();

            await createAuthorDB({ authorCreated, saveAsPublic });

            dispatch({
                type: types.CREATE_AUTHOR,
                payload: { authorCreated, authorStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.CREATE_AUTHOR_STATUS,
                payload: { authorStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const editAuthor = (authorEdited, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.EDIT_AUTHOR_STATUS,
                payload: { authorStatus: "FETCHING", error: null }
            })

            await editAuthorDB({ authorEdited, saveAsPublic });

            dispatch({
                type: types.EDIT_AUTHOR,
                payload: { authorEdited, authorStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.EDIT_AUTHOR_STATUS,
                payload: { authorStatus: "FAILURE", error: error.message }
            })
        }
    }
}

export const deleteAuthor = (authorDeletedId, saveAsPublic = false) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: types.DELETE_AUTHOR_STATUS,
                payload: { authorStatus: "FETCHING", error: null }
            })

            deleteAuthorDB({ authorDeletedId, saveAsPublic });

            dispatch({
                type: types.DELETE_AUTHOR,
                payload: { authorDeletedId, authorStatus: "SUCCESS" }
            })
        } catch (error) {
            console.warn(error);
            dispatch({
                type: types.DELETE_AUTHOR_STATUS,
                payload: { authorStatus: "FAILURE", error: error.message }
            })
        }
    }
}

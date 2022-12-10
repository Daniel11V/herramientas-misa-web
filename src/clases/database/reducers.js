import produce from "immer";
import { database } from "./data";

export const types = {
    SET_DATABASE: 'SET_DATABASE',
    SET_DATABASE_ITEM: 'SET_DATABASE_ITEM',
    DELETE_DATABASE_ITEM: 'DELETE_DATABASE_ITEM',
}

export const setDatabase = (newDatabase) => ({
    type: types.SET_DATABASE,
    payload: { newDatabase }
})

export const setDatabaseItem = (category, id, item) => ({
    type: types.SET_DATABASE_ITEM,
    payload: { category, id, item }
})

export const deleteDatabaseItem = (category, id) => ({
    type: types.DELETE_DATABASE_ITEM,
    payload: { category, id }
})

const initialState = { ...database };

const DatabaseReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.SET_DATABASE:
                newState = payload.newDatabase;
                break;
            case types.SET_DATABASE_ITEM:
                newState[payload.category][payload.id] = payload.item;
                break;
            case types.DELETE_DATABASE_ITEM:
                delete newState[payload.category][payload.id];
                break;

            default:
                break;
        }
    });
}

export default DatabaseReducer
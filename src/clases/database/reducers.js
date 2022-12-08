import produce from "immer";
import { database } from "./data";

export const types = {
    SET_DATABASE: 'SET_DATABASE',
}

export const setDatabase = (newDatabase) => ({
    type: types.SET_DATABASE,
    payload: { newDatabase }
})

const initialState = { ...database };

const DatabaseReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.SET_DATABASE:
                newState = payload.newDatabase;
                break;

            default:
                break;
        }
    });
}

export default DatabaseReducer
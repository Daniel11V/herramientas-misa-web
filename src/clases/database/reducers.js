import { database } from "./data";
import { types } from "./types";


const initialState = { ...database };

const DatabaseReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_DATABASE:
            return { ...payload.newDatabase }

        default:
            return state
    }
}

export default DatabaseReducer
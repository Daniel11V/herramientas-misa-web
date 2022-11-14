import { types } from "./types";

export const setDatabase = (newDatabase) => ({
    type: types.SET_DATABASE,
    payload: { newDatabase }
})

import store from "../../../store";
import { publicRepertoryModel } from "./publicRepertoryList";

export const privateRepertoryModel = {
    ...publicRepertoryModel,
    hasAccess: {
        type: {
            $userId: { type: "String", required: true }, // name
            // ...
        }, required: true
    },
};

export const getPrivateRepertoryListDB = async ({ userId }) => {

    const repertoryList = store.getState().database.privateRepertoryList;

    return repertoryList;
}

export const getPrivateRepertoryDB = async ({ userId, repertoryId }) => {
    if (!repertoryId) throw new Error("Invalid repertory ID.");

    const repertory = store.getState().database.privateRepertoryList[repertoryId];

    return repertory;
}

export const createPrivateRepertoryDB = async ({ repertoryCreated }) => {
    if (!repertoryCreated) throw new Error("Invalid repertory ID.");

    store.getState().database.privateRepertoryList[repertoryCreated.id] = repertoryCreated;
}

export const editPrivateRepertoryDB = async ({ repertoryEdited }) => {

}

export const deletePrivateRepertoryDB = async ({ repertoryDeletedId }) => {

}
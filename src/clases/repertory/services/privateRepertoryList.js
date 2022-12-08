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
    if (!userId) return null;

    const allPrivateRepertoryList = store.getState().database.privateRepertoryList;

    const userPrivateRepertoryList = Object.values(allPrivateRepertoryList)
        .reduce((userPrivateRepertoryList, privateRepertory) =>
            privateRepertory.creator.id === userId ?
                ({ ...userPrivateRepertoryList, [privateRepertory.id]: privateRepertory })
                : userPrivateRepertoryList,
            {}) || {};

    return userPrivateRepertoryList;
}

export const getPrivateRepertoryDB = async ({ userId, repertoryId, hasInvitation = false }) => {
    if (!userId && !hasInvitation) return null;
    if (!repertoryId) throw new Error("Invalid repertory ID.");

    const privateRepertory = store.getState().database.privateRepertoryList[repertoryId];

    if (!!privateRepertory && !hasInvitation) {
        const isAuthorized = privateRepertory.creator.id === userId || !!privateRepertory.hasAccess?.[userId]
        if (!isAuthorized) throw new Error("Unauthorized in getPrivateRepertoryDB.");
    }

    return privateRepertory;
}

export const createPrivateRepertoryDB = async ({ repertoryCreated }) => {
    if (!repertoryCreated) throw new Error("Invalid repertory ID.");

    store.getState().database.privateRepertoryList[repertoryCreated.id] = repertoryCreated;
}

export const editPrivateRepertoryDB = async ({ repertoryEdited }) => {

}

export const deletePrivateRepertoryDB = async ({ repertoryDeletedId }) => {

}
import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { publicSongTitleModel } from "./publicSongTitleList";

export const privateSongTitleModel = {
    ...publicSongTitleModel,
    hasAccess: {
        $userId: "string", // Required, is name
        // ...
    } // Required
};

export const getPrivateSongTitleListDB = async ({ userId }) => {
    if (!userId) return null;

    const allPrivateSongTitleList = store.getState().database.privateSongTitleList

    const userPrivateSongTitleList = Object.values(allPrivateSongTitleList)
        .reduce((userPrivateSongTitleList, privateSongTitle) =>
            privateSongTitle?.creator?.id === userId ?
                ({ ...userPrivateSongTitleList, [privateSongTitle.id]: privateSongTitle })
                : userPrivateSongTitleList,
            {}) || {};

    return userPrivateSongTitleList;
}

export const getPrivateSongTitleDB = async ({ userId, songTitleId, hasInvitation = false }) => {
    if (!userId && !hasInvitation) return null;
    if (!songTitleId) throw new Error("Invalid song title ID.");

    const privateSongTitle = store.getState().database.privateSongTitleList[songTitleId];

    if (!!privateSongTitle && !hasInvitation) {
        const isAuthorized = privateSongTitle.creator.id === userId || !!privateSongTitle.hasAccess?.[userId]
        if (!isAuthorized) throw new Error("Unauthorized in getPrivateSongTitleDB.");
    }

    return privateSongTitle;
}

export const createPrivateSongTitleDB = async ({ songTitleCreated }) => {
    const newId = new Date().getTime().toString();
    const newSongTitle = {
        id: newId,
        versionGroupId: newId,
        ...songTitleCreated,
    }
    await store.dispatch(setDatabaseItem("privateSongTitleList", newId, newSongTitle));
    return newSongTitle;
}

export const editPrivateSongTitleDB = async ({ songTitleEdited }) => {
    await store.dispatch(setDatabaseItem("privateSongTitleList", songTitleEdited.id, songTitleEdited));
    return;
}

export const deletePrivateSongTitleDB = async ({ songTitleId }) => {
    await store.dispatch(deleteDatabaseItem("privateSongTitleList", songTitleId));
    return songTitleId;
}
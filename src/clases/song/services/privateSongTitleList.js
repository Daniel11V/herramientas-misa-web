import store from "../../../store";
import { publicSongTitleModel } from "./publicSongTitleList";

export const privateSongTitleModel = {
    ...publicSongTitleModel,
    hasAccess: {
        type: {
            $userId: { type: "String", required: true }, // name
            // ...
        }, required: true
    },
};

export const getPrivateSongTitleListDB = async ({ userId }) => {
    if (!userId) return null;

    const allPrivateSongTitleList = store.getState().database.privateSongTitleList

    const userPrivateSongTitleList = Object.values(allPrivateSongTitleList)
        .reduce((userPrivateSongTitleList, privateSongTitle) =>
            privateSongTitle.creator.id === userId ?
                ({ ...userPrivateSongTitleList, [privateSongTitle.id]: privateSongTitle })
                : userPrivateSongTitleList,
            {}) || {};

    return userPrivateSongTitleList;
}

export const getPrivateSongTitleDB = async ({ userId, songId }) => {
    if (!userId) return null;
    if (!songId) throw new Error("Invalid song ID.");

    const privateSongTitle = store.getState().database.privateSongTitleList[songId];

    if (!!privateSongTitle) {
        const isAuthorized = privateSongTitle.creator === userId || !!privateSongTitle.hasAccess?.[userId]
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
    store.getState().database.privateSongTitleList[newId] = newSongTitle;

    return newSongTitle;
}
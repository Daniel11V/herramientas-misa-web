import store from "../../../store";
import { publicSongTitleModel } from "./publicSongTitleList";

export const privateSongTitleModel = {
    ...publicSongTitleModel,
    publicDetailId: { type: "String", required: false },
    hasAccess: {
        type: {
            $userId: { type: "String", required: true }, // name
            // ...
        }, required: true
    },
};

export const getPrivateSongTitleListDB = async ({ userId }) => {
    if (!userId) return {};

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
    if (!userId) return {};
    if (!songId) throw new Error("Invalid song ID.");

    const privateSongTitle = store.getState().database.privateSongTitleList[songId];

    if (!!privateSongTitle) {
        const isAuthorized = privateSongTitle.creator === userId || !!privateSongTitle.hasAccess?.[userId]
        if (!isAuthorized) throw new Error("Unauthorized in getPrivateSongTitleDB.");
    }

    return privateSongTitle;
}

export const createPrivateSongTitleDB = async ({ songTitleCreated }) => {

    if (!songTitleCreated?.id) throw new Error("Invalid song ID.");

    store.getState().database.privateSongTitleList[songTitleCreated.id] = songTitleCreated;
    const response = songTitleCreated;

    if (!response) throw new Error("Error fetching in createPrivateSongTitleDB.");

    return response;
}
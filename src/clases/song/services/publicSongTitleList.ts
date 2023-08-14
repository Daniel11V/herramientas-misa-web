import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

export const getPublicSongTitleListDB = async () => {

    const publicSongTitleList = store.getState().database.publicSongTitleList;

    if (!publicSongTitleList) throw new Error("Error fetching.");

    return publicSongTitleList;
}

export const getPublicSongTitleDB = async ({ songTitleId }) => {

    if (!songTitleId) throw new Error("Invalid song title ID.");

    const publicSongTitle = store.getState().database.publicSongTitleList[songTitleId];

    return publicSongTitle;
}

export const createPublicSongTitleDB = async ({ songTitleCreated }) => {

    if (!songTitleCreated?.id) throw new Error("Invalid song ID.");

    await store.dispatch(setDatabaseItem("publicSongTitleList", songTitleCreated.id, songTitleCreated));
    const response = songTitleCreated;

    if (!response) throw new Error("Error fetching in createPublicSongTitleDB.");

    return response;
}

export const editPublicSongTitleDB = async ({ songTitleEdited }) => {
    await store.dispatch(setDatabaseItem("publicSongTitleList", songTitleEdited.id, songTitleEdited));
    return;
}
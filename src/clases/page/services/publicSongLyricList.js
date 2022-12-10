import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

export const publicSongLyricModel = {
    // songTitleId: { type: "String", required: true },
    // id: { type: "String", required: true },
    lyric: { type: "String", required: true }
}

export const getPublicSongLyricDB = async ({ songId }) => {
    if (!songId) throw new Error("Invalid song ID.");

    const publicSongLyric = store.getState().database.publicSongLyricList[songId];

    return publicSongLyric;
}

export const createPublicSongLyricDB = async ({ songLyricCreated }) => {

    if (!songLyricCreated?.id) throw new Error("Invalid song ID.");

    await store.dispatch(setDatabaseItem("publicSongLyricList", songLyricCreated.id, songLyricCreated));
    const response = songLyricCreated;

    if (!response) throw new Error("Error in createPublicSongLyricDB.");

    return response;
}
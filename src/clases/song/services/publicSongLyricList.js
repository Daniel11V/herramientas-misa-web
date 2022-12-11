import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

export const publicSongLyricModel = {
    // songTitleId: { type: "String", required: true },
    // id: { type: "String", required: true },
    lyric: { type: "String", required: true }
}

export const getPublicSongLyricDB = async ({ songLyricId }) => {
    if (!songLyricId) throw new Error("Invalid song ID.");

    const publicSongLyric = store.getState().database.publicSongLyricList[songLyricId];

    return publicSongLyric;
}

export const createPublicSongLyricDB = async ({ lyric }) => {

    if (!lyric) throw new Error("Invalid lyric.");
    const newId = new Date().getTime()
    await store.dispatch(setDatabaseItem("publicSongLyricList", newId, { lyric }));
    const response = { id: newId, lyric };

    if (!response) throw new Error("Error in createPublicSongLyricDB.");

    return response;
}
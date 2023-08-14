import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

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

export const editPublicSongLyricDB = async ({ lyricId, lyric }) => {
    await store.dispatch(setDatabaseItem("publicSongLyricList", lyricId, { lyric }));
    return;
}
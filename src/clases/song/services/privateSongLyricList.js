import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { publicSongLyricModel } from "./publicSongLyricList";

export const privateSongLyricModel = {
    ...publicSongLyricModel,
};

export const getPrivateSongLyricListDB = async ({ userId }) => {
    if (!userId) throw new Error("Invalid user ID.");

    const privateSongLyric = store.getState().database.privateSongLyricList;

    return privateSongLyric;
}

export const getPrivateSongLyricDB = async ({ songId }) => {
    if (!songId) throw new Error("Invalid song ID.");

    const privateSongLyric = store.getState().database.privateSongLyricList[songId];

    return privateSongLyric;
}

export const createPrivateSongLyricDB = async ({ lyric }) => {

    const newId = new Date().getTime()
    await store.dispatch(setDatabaseItem("privateSongLyricList", newId, { lyric }));
    const response = { id: newId.toString(), lyric };

    if (!response) throw new Error("Error fetching in createPrivateSongLyricDB.");

    return response;
}

export const deletePrivateSongLyricDB = async ({ songLyricId }) => {
    await store.dispatch(deleteDatabaseItem("privateSongLyricList", songLyricId));
    return songLyricId;
}
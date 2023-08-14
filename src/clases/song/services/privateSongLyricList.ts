import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";

export const getPrivateSongLyricListDB = async ({ songLyricId, userId }) => {
    if (!songLyricId) throw new Error("Invalid user ID.");

    const allPrivateSongLyricList = store.getState().database.privateSongLyricList;

    const userPrivateSongLyricList = Object.values(allPrivateSongLyricList)
        .reduce((userPrivateSongLyricList, privateSongLyric) =>
            privateSongLyric.creator.id === userId ?
                ({ ...userPrivateSongLyricList, [privateSongLyric.id]: privateSongLyric })
                : userPrivateSongLyricList,
            {}) || {};

    return userPrivateSongLyricList;
}

export const getPrivateSongLyricDB = async ({ songLyricId }) => {
    if (!songLyricId) throw new Error("Invalid song lyric ID.");

    const privateSongLyric = store.getState().database.privateSongLyricList[songLyricId];

    return privateSongLyric;
}

export const createPrivateSongLyricDB = async ({ lyric }) => {

    const newId = new Date().getTime()
    await store.dispatch(setDatabaseItem("privateSongLyricList", newId, { lyric }));
    const response = { id: newId.toString(), lyric };

    if (!response) throw new Error("Error fetching in createPrivateSongLyricDB.");

    return response;
}

export const editPrivateSongLyricDB = async ({ lyricId, lyric }) => {
    await store.dispatch(setDatabaseItem("privateSongLyricList", lyricId, { lyric }));
    return;
}

export const deletePrivateSongLyricDB = async ({ songLyricId }) => {
    await store.dispatch(deleteDatabaseItem("privateSongLyricList", songLyricId));
    return songLyricId;
}
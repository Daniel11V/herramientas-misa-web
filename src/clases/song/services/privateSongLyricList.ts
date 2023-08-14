import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { IPrivateSongLyricDB } from "../types";

export const getPrivateSongLyricListDB = async (p: { songLyricId: string, userId: string }): Promise<IPrivateSongLyricDB[]> => {
    const { songLyricId, userId } = p;
    
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

export const getPrivateSongLyricDB = async (p: { songLyricId: string }): Promise<IPrivateSongLyricDB> => {
    const { songLyricId } = p;
    if (!songLyricId) throw new Error("Invalid song lyric ID.");

    const privateSongLyric = store.getState().database.privateSongLyricList[songLyricId];

    return privateSongLyric;
}

export const createPrivateSongLyricDB = async (p: { lyric: string }): Promise<{ id: string, lyric: string}> => {
    const { lyric } = p;
    const newId = new Date().getTime()
    await store.dispatch(setDatabaseItem("privateSongLyricList", newId, { lyric }));
    const response = { id: newId.toString(), lyric };

    if (!response) throw new Error("Error fetching in createPrivateSongLyricDB.");

    return response;
}

export const editPrivateSongLyricDB = async (p: { lyricId: string, lyric: string }): Promise<void> => {
    const { lyricId, lyric } = p;
    await store.dispatch(setDatabaseItem("privateSongLyricList", lyricId, { lyric }));
    return;
}

export const deletePrivateSongLyricDB = async (p: { songLyricId: string }): Promise<string> => {
    const { songLyricId } = p;
    await store.dispatch(deleteDatabaseItem("privateSongLyricList", songLyricId));
    return songLyricId;
}
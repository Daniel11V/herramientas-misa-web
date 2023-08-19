import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";
import { TPublicSongTitleDB, TPublicSongTitleListDB, TSong, TSongForm, TSongId } from "../types";

export const getPublicSongTitleListDB = async (): Promise<TPublicSongTitleListDB> => {

    const publicSongTitleList = store.getState().database.publicSongTitleList;

    if (!publicSongTitleList) throw new Error("Error fetching.");

    return publicSongTitleList;
}

export const getPublicSongTitleDB = async (p: { songTitleId: TSongId }): Promise<TPublicSongTitleDB> => {
    const { songTitleId } = p;
    if (!songTitleId) throw new Error("Invalid song title ID.");

    const publicSongTitle = store.getState().database.publicSongTitleList[songTitleId];

    return publicSongTitle;
}

export const createPublicSongTitleDB = async (p:{ songTitleCreated: TPublicSongTitleDB }): Promise<TSongId> => {
    const { songTitleCreated } = p
    const newId = new Date().getTime().toString();
    await store.dispatch(setDatabaseItem("publicSongTitleList", newId, songTitleCreated));
    const response = songTitleCreated;

    if (!response) throw new Error("Error fetching in createPublicSongTitleDB.");

    return newId;
}

export const editPublicSongTitleDB = async (p:{ songTitleEdited: TSong }) => {
    const { songTitleEdited } = p;
    await store.dispatch(setDatabaseItem("publicSongTitleList", songTitleEdited.id, songTitleEdited));
    return;
}
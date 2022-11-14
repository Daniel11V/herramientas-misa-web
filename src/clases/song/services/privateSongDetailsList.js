import store from "../../../store";
import { publicSongDetailsModel } from "./publicSongDetailsList";

export const privateSongDetailsModel = {
    ...publicSongDetailsModel,
};

export const getPrivateSongDetailsListDB = async ({ songId }) => {
    if (!songId) throw new Error("Invalid song ID.");

    const privateSongDetails = store.getState().database.privateSongDetailsList[songId];

    return privateSongDetails;
}

export const createPrivateSongDetailsDB = async ({ songDetailsCreated }) => {

    if (!songDetailsCreated?.id) throw new Error("Invalid song ID.");

    store.getState().database.privateSongDetailsList[songDetailsCreated.id] = songDetailsCreated;
    const response = songDetailsCreated;

    if (!response) throw new Error("Error fetching in createPrivateSongDetailsDB.");

    return response;
}
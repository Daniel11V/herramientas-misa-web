import store from "../../../store";

export const publicSongDetailsModel = {
    songTitleId: { type: "String", required: true },
    description: { type: "String", required: false },
    pulse: { type: "String", required: false },
    tempo: { type: "String", required: false },
    lyric: { type: "String", required: true }
}

export const getPublicSongDetailsDB = async ({ songId }) => {
    if (!songId) throw new Error("Invalid song ID.");

    const publicSongDetails = store.getState().database.publicSongDetailsList[songId];

    return publicSongDetails;
}

export const createPublicSongDetailsDB = async ({ songDetailsCreated }) => {

    if (!songDetailsCreated?.id) throw new Error("Invalid song ID.");

    store.getState().database.publicSongDetailsList[songDetailsCreated.id] = songDetailsCreated;
    const response = songDetailsCreated;

    if (!response) throw new Error("Error in createPublicSongDetailsDB.");

    return response;
}
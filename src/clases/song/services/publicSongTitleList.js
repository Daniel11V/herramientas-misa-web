import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

export const publicSongTitleModel = {
    id: "string", // Required
    versionGroupId: "string", // Required
    isPrivate: [true, false], // Required
    lyricId: "string", // Required
    lyricIsPrivate: [true, false], // Required
    title: "string", // Required
    lyricStart: "string", // Required
    author: {
        id: "string", // Required
        name: "string", // Required
    },
    creator: {
        id: "string", // Required
        name: "string", // Required
    }, // Required
    labels: [],
    topics: [],
    rating: [],
    level: {
        general: "number", // Required
        guitar: "number",
        //...
    }, // Required
    annotations: "string",
    tone: "string",
    pulse: "string",
    tempo: "string",
};

/*
export const songLevels = {
    1: "Aprendiendo Melodía: todovía no me sale cantarla",
    2: "Aprendiendo Letra: la puedo cantar viendo la letra",
    3: "Masterizada: la puedo tocar solo",
    4: "Memorizada: me la se de memoria",
}
*/

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
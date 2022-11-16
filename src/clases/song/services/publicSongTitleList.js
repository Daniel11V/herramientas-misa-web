import store from "../../../store";

export const publicSongTitleModel = {
    id: { type: "String", required: true },
    versionGroupId: { type: "String", required: true },
    isPrivate: { type: "Bool", required: true },
    title: { type: "String", required: true },
    author: {
        type: {
            id: { type: "String", required: true },
            name: { type: "String", required: true },
        }, required: false
    },
    creator: {
        type: {
            id: { type: "String", required: true },
            name: { type: "String", required: true },
        }, required: true
    },
    labels: { type: "Array", required: false },
    topics: { type: "Array", required: false },
    rating: { type: "Array", required: false },
    level: {
        type: {
            main: { type: "Number", required: true },
            voice: { type: "Number", required: false },
            guitar: { type: "Number", required: false },
            //...
        }, required: true
    },
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

export const getPublicSongTitleDB = async ({ songId }) => {

    if (!songId) throw new Error("Invalid song ID.");

    const publicSongTitle = store.getState().database.publicSongTitleList[songId];

    return publicSongTitle;
}

export const createPublicSongTitleDB = async ({ songTitleCreated }) => {

    if (!songTitleCreated?.id) throw new Error("Invalid song ID.");

    store.getState().database.publicSongTitleList[songTitleCreated.id] = songTitleCreated;
    const response = songTitleCreated;

    if (!response) throw new Error("Error fetching in createPublicSongTitleDB.");

    return response;
}
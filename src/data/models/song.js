export const author = {
    id: { type: "String", required: true },
    name: { type: "String", required: false },
    email: { type: "String", required: false },
    photoUrl: { type: "String", required: false },
};
export const user = {
    id: { type: "String", required: true },
    name: { type: "String", required: false },
    email: { type: "String", required: false },
    photoUrl: { type: "String", required: false },
};

export const publicSongTitle = {
    id: { type: "String", required: true },
    versionGroupId: { type: "String", required: true },
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

export const publicSongDetail = {
    songTitleId: { type: "String", required: true },
    description: { type: "String", required: false },
    pulse: { type: "String", required: false },
    tempo: { type: "String", required: false },
    lyric: { type: "String", required: true }
}

export const privateSongTitle = {
    ...publicSongTitle,
    songDetailId: { type: "String", required: false },
    hasAccess: {
        type: {
            $userId: { type: "String", required: true }, // name
            // ...
        }, required: true
    },
};

export const privateSongDetail = {
    ...publicSongDetail,
};

export const levels = {
    1: "Aprendiendo Melodía: todovía no me sale cantarla",
    2: "Aprendiendo Letra: la puedo cantar viendo la letra",
    3: "Masterizada: la puedo tocar solo",
    4: "Memorizada: me la se de memoria",
}

export const databaseSchema = {
    users: {
        "$userId": user,
        // ...
    },
    privateSongTitles: {
        "$pushId": privateSongTitle,
        // ...
    },
    privateSongDetails: {
        "$privateSongTitleId": privateSongDetail,
        // ...
    },
    publicSongTitles: {
        "$pushId": publicSongTitle,
        // ...
    },
    publicSongDetails: {
        "$publicSongTitleId": publicSongDetail,
        // ...
    },
}
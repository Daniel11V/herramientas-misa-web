export const publicSongTitles = {
    id: { type: "String", required: true },
    versionGroupId: { type: "String", required: true },
    title: { type: "String", required: true },
    author: {
        type: {
            id: { type: "String", required: true },
            name: { type: "String", required: true },
        }, required: false
    },
    labels: { type: "Array", required: false },
    topics: { type: "Array", required: false },
    rating: { type: "Array", required: false }
};

export const publicSongs = {
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
    pulse: { type: "String", required: false },
    tempo: { type: "String", required: false },
    labels: { type: "Array", required: false },
    topics: { type: "Array", required: false },
    rating: { type: "Array", required: false },
    description: { type: "String", required: false },
    lyric: { type: "String", required: true },
    // chords: { type: "Object", required: false },
};

export const userSongTitles = {
    id: { type: "String", required: true },
    originalSongId: { type: "String", required: true },
    title: { type: "String", required: true },
    author: {
        type: {
            id: { type: "String", required: true },
            name: { type: "String", required: true },
        }, required: false
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

export const userSongs = {
    id: { type: "String", required: true },
    originalSongId: { type: "String", required: true },
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
    pulse: { type: "String", required: false },
    tempo: { type: "String", required: false },
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
    description: { type: "String", required: false },
    lyric: { type: "String", required: true },
};

export const levels = {
    1: "Aprendiendo Melodía: todovía no me sale cantarla",
    2: "Aprendiendo Letra: la puedo cantar viendo la letra",
    3: "Masterizada: la puedo tocar solo",
    4: "Memorizada: me la se de memoria",
}

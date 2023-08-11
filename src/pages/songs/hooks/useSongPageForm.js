import { useState, useEffect } from "react";

const emptySong = {
    id: "", // Required
    versionGroupId: "", // Required
    isPrivate: true, // Required
    lyricId: "", // Required
    lyricIsPrivate: true, // Required
    title: "", // Required
    lyricStart: "",
    author: { value: "-", label: "Desconocido" },
    creator: {
        id: "", // Required
        name: "", // Required
    }, // Required
    labels: { type: "Array", required: false },
    topics: { type: "Array", required: false },
    rating: { type: "Array", required: false },
    level: {
        type: {
            general: { type: "Number", required: true }, // Required
            guitar: { type: "Number", required: false },
            //...
        }, required: true
    },
    annotations: "",
    tone: "",
    pulse: "",
    tempo: "",
    lyric: ""
};

export const useSongPageForm = (song) => {
    const [songForm, setSongForm] = useState(emptySong)

    useEffect(() => {
        if (!!song.name) setSongForm(song)
    }, [song])

    const saveChanges = () => {

    }


    return {
        songForm, saveChanges
    };
};
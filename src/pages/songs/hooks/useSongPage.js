import { useState, useEffect, useCallback } from "react";
import M from "materialize-css";
import { objsAreEqual } from "../../../utils";
import { useSong } from "./useSong";
import { useDispatch, useSelector } from "react-redux";
import { getAuthorList } from "../../../clases/author/actions";

export const useSongPage = (songTitleId) => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.google.id);
    const { authorList } = useSelector((state) => state.author);
    const { song, isLoadingSong, errorSong, editSong } = useSong(songTitleId, userId);

    const [areNewSongOptions, setAreNewSongOptions] = useState(false)
    const [songOptions, setSongOptions] = useState({
        tone: null,
        annotations: "",
        level: { voice: null }
    })
    const [savingSongOptions, setSavingSongOptions] = useState(false)
    const voiceLevelOptions = {
        voice: [
            { value: "0", label: "0. Nueva: guardada en mi biblioteca" },
            { value: "1", label: "1. Conocida: la puedo tocar acompañado y viendo la letra" },
            { value: "2", label: "2. Aprendida: la puedo tocar solo" },
            { value: "3", label: "3. Memorizada: me la se de memoria" },
        ]
    }
    const [authorInstance, setAuthorInstance] = useState(null)
    const [songForm, setSongForm] = useState({
        id: "", // Required
        versionGroupId: "", // Required
        isPrivate: true, // Required
        lyricId: "", // Required
        lyricIsPrivate: true, // Required
        title: "", // Required
        lyricStart: "",
        author: { id: "", name: "" },
        creator: {
            id: "", // Required
            name: "", // Required
        }, // Required
        labels: [],
        topics: [],
        rating: [],
        level: {
            voice: 0, // Required
        },
        annotations: "",
        tone: "",
        pulse: "",
        tempo: "",
        lyric: ""
    })

    useEffect(() => {
        if (!!song?.title) setSongForm(song);
    }, [song])

    const editForm = useCallback((key, value) => {
        if (key === "author") {
            setSongForm(v => ({ ...v, [key]: { 
                name: value, 
                id: authorList?.find(authorSearch => authorSearch.name === value)?.id || new Date().getTime()
            }}));
        } else {
            setSongForm(v => ({ ...v, [key]: value }));
        }

        if (key === "author" && !authorInstance) {
            setAuthorInstance(M.Autocomplete.init(document.querySelectorAll(".autocomplete"), {
                onAutocomplete: (authorName) => {
                    editForm("author", authorName)
                },
                limit: 20
            })[0])
            dispatch(getAuthorList({ userId }));
        }
        console.log("ACA editForm: ", { key, value, songForm })
    }, [authorList])

    useEffect(() => {
        if (authorList?.length && !!authorInstance) {
            authorInstance.updateData(authorList.reduce((allAuthors, author) => ({ ...allAuthors, [author?.name]: null }), {}));
        }
    }, [authorList, authorInstance])


    const setSongPageOptionsField = (field, newVal) => {
        setSongOptions(lv => {
            if (lv[field] !== newVal) {

                const newSongOptions = {
                    ...lv,
                    [field]: newVal,
                }
                const finalSongOptions = {
                    tone: song.tone || "",
                    annotations: song.annotations || "",
                    level: song.level,
                }
                setAreNewSongOptions(!objsAreEqual(finalSongOptions, newSongOptions))

                return newSongOptions
            } else {
                return lv;
            }
        })
    }

    const setTone = (newTone, changeDefaultTone = false) => {
        if (newTone !== songOptions.tone) {
            if (changeDefaultTone) {
                setSongPageOptionsField("tone", newTone);
            } else {
                setSongOptions(lv => ({ ...lv, tone: newTone }));
            }
        }
    }
    const setAnnotations = (newAnnotations) => {
        if (newAnnotations !== songOptions.annotations) {
            setSongPageOptionsField("annotations", newAnnotations);
        }
    }
    const setVoiceLevel = (newVoiceLevel) => {
        if (newVoiceLevel !== songOptions.level?.voice) {
            setSongPageOptionsField("level", { ...songOptions.level, voice: newVoiceLevel });
        }
    }

    const saveSongOptions = () => {
        const finalLevel = {}
        for (const levelType in songOptions.level) {
            finalLevel[levelType] = Number(songOptions.level[levelType]);
        }
        editSong({ ...song, ...songOptions, level: finalLevel });
        setSavingSongOptions(true);
    }

    useEffect(() => {
        if (!!savingSongOptions && !isLoadingSong) {
            setSavingSongOptions(false);
            setAreNewSongOptions(false);
            M.toast({ html: "Guardado con exito." });
        }
    }, [savingSongOptions, isLoadingSong])


    // useEffect(() => {
    //     setStatus("1_SONG");
    // }, [])

    // useEffect(() => {
    //     if (status === "1_SONG") {
    //         if (!songTitleId) {
    //             setStatus("FINISHED");
    //         } else if (song.id === songTitleId) {
    //             setCurrentSong(song);
    //             setStatus("FINISHED");
    //         } else if (retrys < MAX_RETRYS) {
    //             setStatus("1_FETCH_SONG");
    //             setRetrys(retrys + 1);
    //         } else {
    //             setError("Sin conexión, pruebe recargando la página.")
    //             setStatus("FINISHED");
    //         }
    //     }
    // }, [status, song, songTitleId, retrys])

    // useEffect(() => {
    //     if (status === "1_FETCH_SONG") {
    //         if (songRequestStatus === "INITIAL") {
    //             dispatch(getSong({ userId, songTitleId }));
    //         } else if (songRequestStatus === "SUCCESS") {
    //             setStatus("1_SONG");
    //             dispatch(resetSongRequestStatus());
    //             setError(null);
    //         } else if (songRequestStatus === "FAILURE") {
    //             setStatus("FINISHED");
    //             dispatch(resetSongRequestStatus());
    //         }
    //     }
    // }, [status, songRequestStatus, userId, songTitleId, dispatch]);

    // useEffect(() => {
    //     if (userId && !currentSong.id) {
    //         setStatus("1_SONG");
    //     }
    // }, [userId, currentSong]);

    return {
        song,
        isLoadingPage: isLoadingSong,
        errorPage: errorSong,
        tone: songOptions.tone,
        setTone,
        annotations: songOptions.annotations,
        setAnnotations,
        voiceLevel: songOptions.level?.voice,
        setVoiceLevel,
        voiceLevelOptions,
        areNewSongOptions,
        saveSongOptions,
        songForm, editForm,
    };
};
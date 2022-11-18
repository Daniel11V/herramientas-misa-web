import M from "materialize-css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSong, editSong, getSong, resetSongStatus } from "../../../clases/song/actions";
import { MAX_RETRYS } from "../../../configs";
import { getChordsFromLyric, getLyricWithChords } from "../../../utils";

export const useSongFormPage = (songId) => {
    const dispatch = useDispatch();

    const [songForm, setSongForm] = useState({
        creator: null,
        title: "",
        author: "",
        lyric: "",
        chords: "",
        tempo: "",
        pulse: "",
        labels: "",
    });
    const [status, setSongFormStatus] = useState("INITIAL");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const userId = useSelector((state) => state.user?.google?.id);
    const userName = useSelector((state) => state.user?.google?.name);
    const { song, songStatus, songError } = useSelector((state) => state.song);
    const [retrys, setRetrys] = useState(0);

    const [formStep, setFormStep] = useState("INITIAL");
    const [onlyLiric, setOnlyLyric] = useState("");
    const [chordLang, setChordLang] = useState({});
    const [editOnlyChords, setEditOnlyChords] = useState(false);
    const history = useHistory();

    const setStatus = (newStatus) => {
        // console.log("ACA SONG_FORM_STATUS: ", newStatus);
        setSongFormStatus(newStatus);
    }

    useEffect(() => {
        setIsLoading(status !== "FINISHED");
    }, [status])

    useEffect(() => {
        setError(songError);
    }, [songError])

    useEffect(() => {
        setStatus("1_SONG");
    }, [])

    useEffect(() => {
        if (status === "1_SONG") {
            if (!songId) {
                setStatus("FINISHED");
                setFormStep("DESCRIPTION");
            } else if (song.id === songId) {
                setSongForm(song);
                setStatus("FINISHED");
                setFormStep("DESCRIPTION");
            } else if (retrys < MAX_RETRYS) {
                setStatus("1_FETCH_SONG");
                setRetrys(retrys + 1);
            } else {
                setError("Sin conexión, pruebe recargando la página.")
                setStatus("FINISHED");
            }
        }
    }, [status, song, songId, retrys])

    useEffect(() => {
        if (status === "1_FETCH_SONG") {
            if (songStatus === "INITIAL") {
                dispatch(getSong({ userId, songId }));
            } else if (songStatus === "SUCCESS") {
                setStatus("1_SONG");
                dispatch(resetSongStatus());
            } else if (songStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongStatus());
            }
        }
    }, [status, songStatus, userId, songId, dispatch]);

    const nextStep = (e) => {
        e.preventDefault();

        if (formStep === "DESCRIPTION") {
            setFormStep("LYRIC_CHORDS");
        } else if (formStep === "LYRIC_CHORDS") {
            setFormStep("EXTRA_DETAILS");
        } else if (formStep === "EXTRA_DETAILS") {

            // Validate
            setSongForm(lastSongForm => ({ ...lastSongForm, creator: lastSongForm.creator || userName }))

            setFormStep("SUBMIT_SONG_FORM");
        }
    }

    const setField = (field, value) => {
        setSongForm(lastSongForm => ({
            ...lastSongForm,
            [field]: value
        }))
    }

    const toogleEditOnlyChords = () => {
        if (editOnlyChords === true) {
            setField("lyric", getLyricWithChords(onlyLiric, songForm.chords));
        } else {
            const {
                chords: chordsNew,
                chordLang: chordLangNew,
                onlyLyric: onlyLyricNew,
            } = getChordsFromLyric(songForm.lyric);
            setField("chords", chordsNew);
            setChordLang(chordLangNew);
            setOnlyLyric(onlyLyricNew);
        }

        setEditOnlyChords(!editOnlyChords);
    };

    useEffect(() => {
        if (formStep === "SUBMIT_SONG_FORM") {
            const saveAsPublic = false;

            if (songId) {
                if (songStatus === "INITIAL") {
                    dispatch(editSong(songForm, saveAsPublic));
                } else if (songStatus === "SUCCESS") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Canción Actualizada" });
                    dispatch(resetSongStatus());
                    history.goBack();
                } else if (songStatus === "FAILURE") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Error actualizando la canción" });
                    dispatch(resetSongStatus());
                    history.goBack();
                }
            } else {
                if (songStatus === "INITIAL") {
                    dispatch(createSong(songForm, saveAsPublic));
                } else if (songStatus === "SUCCESS") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Canción Guardada" });
                    dispatch(resetSongStatus());
                    history.goBack();
                } else if (songStatus === "FAILURE") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Error guardando la canción" });
                    dispatch(resetSongStatus());
                    history.goBack();
                }
            }
        }
    }, [formStep, songForm, userName, songId, songStatus, dispatch, history]);


    return { songForm, isLoading, error, formStep, nextStep, setField, toogleEditOnlyChords, onlyLiric, chordLang, editOnlyChords };
};
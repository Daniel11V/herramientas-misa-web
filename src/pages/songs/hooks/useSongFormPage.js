import M from "materialize-css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createAuthor, getAuthorList, resetAuthorStatus } from "../../../clases/author/actions";
import { createSong, editSong, getSong, resetSongStatus } from "../../../clases/song/actions";
import { MAX_RETRYS } from "../../../configs";
import { arrayIsEmpty, getChordsFromLyric, getLyricWithChords } from "../../../utils";

export const useSongFormPage = (songId) => {
    const dispatch = useDispatch();

    const [songForm, setSongForm] = useState({
        creator: null,
        title: "",
        author: { value: "-", label: "Desconocido" },
        annotations: "",
        lyric: "",
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
    const { authorList, authorStatus, authorError } = useSelector((state) => state.author);
    const [authorItems, setAuthorItems] = useState([])
    const [authorForm, setAuthorForm] = useState({
        name: "",
        email: "",
        photoUrl: "",
    });

    const [formStep, setFormStep] = useState("INITIAL");
    const [onlyLiric, setOnlyLyric] = useState("");
    const [chords, setChords] = useState("")
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
        if (songError) setError(songError);
        if (authorError) setError(authorError);
    }, [songError, authorError])

    useEffect(() => {
        setStatus("1_SONG");
    }, [])

    useEffect(() => {
        if (status === "1_SONG") {
            if (!songId) {
                setStatus("2_AUTHOR_LIST");
                // setStatus("FINISHED");
                // setFormStep("DESCRIPTION");
            } else if (song.id === songId) {
                setSongForm({ ...song, author: { value: song?.author?.id || "-", label: song?.author?.name || "Desconocido" } });
                setRetrys(0);
                setStatus("2_AUTHOR_LIST");
                // setStatus("FINISHED");
                // setFormStep("DESCRIPTION");
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
                setError(null);
            } else if (songStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongStatus());
            }
        }
    }, [status, songStatus, userId, songId, dispatch]);

    useEffect(() => {
        if (status === "2_AUTHOR_LIST") {
            if (!arrayIsEmpty(authorList)) {
                const newAuthorItems = authorList.reduce((tO, e) => [...tO, { value: e.id, label: e.name }], [{ value: "-", label: "Desconocido" }]);
                newAuthorItems.push({ value: "Other", label: "Otro..." });
                setAuthorItems(newAuthorItems);
                setStatus("FINISHED");
                setFormStep("DESCRIPTION");
            } else if (retrys < MAX_RETRYS) {
                setStatus("2_FETCH_AUTHOR_LIST");
                setRetrys(retrys + 1);
            } else {
                setError("Sin conexión, pruebe recargando la página.")
                setStatus("FINISHED");
            }
        }
    }, [status, authorList, retrys])

    useEffect(() => {
        if (status === "2_FETCH_AUTHOR_LIST") {
            if (authorStatus === "INITIAL") {
                dispatch(getAuthorList());
            } else if (authorStatus === "SUCCESS") {
                setStatus("2_AUTHOR_LIST");
                dispatch(resetAuthorStatus());
                setError(null);
            } else if (authorStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetAuthorStatus());
            }
        }
    }, [status, authorStatus, dispatch]);

    const nextStep = (e) => {
        e.preventDefault();

        if (formStep === "DESCRIPTION") {
            setFormStep("LYRIC_CHORDS");
        } else if (formStep === "LYRIC_CHORDS") {
            setFormStep("EXTRA_DETAILS");
        } else if (formStep === "EXTRA_DETAILS") {

            // Validate
            setSongForm(lastSongForm => ({ ...lastSongForm, creator: { name: lastSongForm?.creator?.name || userName, id: lastSongForm?.creator?.id || userId } }))

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
            setField("lyric", getLyricWithChords(onlyLiric, chords));
        } else {
            const {
                chords: chordsNew,
                chordLang: chordLangNew,
                onlyLyric: onlyLyricNew,
            } = getChordsFromLyric(songForm.lyric);
            setChords(chordsNew);
            setChordLang(chordLangNew);
            setOnlyLyric(onlyLyricNew);
        }

        setEditOnlyChords(!editOnlyChords);
    };

    const setAuthorField = (field, value) => {
        setAuthorForm(lastAuthorForm => ({
            ...lastAuthorForm,
            [field]: value
        }))
    }

    useEffect(() => {
        if (formStep === "SUBMIT_SONG_FORM") {
            const saveAsPublic = false;

            if (songId) {
                if (songStatus === "INITIAL") {
                    dispatch(editSong(songForm, saveAsPublic));
                } else if (songStatus === "SUCCESS") {
                    M.toast({ html: "Canción Actualizada" });
                    dispatch(resetSongStatus());
                    if (songForm.author.value === "Other") {
                        setFormStep("SUBMIT_NEW_AUTHOR");
                    } else {
                        setFormStep("FINISHED");
                        history.goBack();
                    }
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
                    M.toast({ html: "Canción Guardada" });
                    dispatch(resetSongStatus());
                    if (songForm.author.value === "Other") {
                        setFormStep("SUBMIT_NEW_AUTHOR");
                    } else {
                        setFormStep("FINISHED");
                        history.goBack();
                    }
                } else if (songStatus === "FAILURE") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Error guardando la canción" });
                    dispatch(resetSongStatus());
                    history.goBack();
                }
            }
        }
    }, [formStep, songForm, userName, songId, songStatus, dispatch, history]);

    useEffect(() => {
        if (formStep === "SUBMIT_NEW_AUTHOR") {
            const newAuthor = {
                id: new Date().getTime().toString(),
                ...authorForm,
                creatorId: userId,
                songTitleIds: "",
            }

            if (userId === "") {
                if (authorStatus === "INITIAL") {
                    dispatch(createAuthor(newAuthor));
                } else if (authorStatus === "SUCCESS") {
                    M.toast({ html: "Artista Añadido." });
                    dispatch(resetAuthorStatus());
                    setFormStep("FINISHED");
                    history.goBack();
                } else if (authorStatus === "FAILURE") {
                    setFormStep("FINISHED");
                    M.toast({ html: "Error guardando la canción" });
                    dispatch(resetAuthorStatus());
                    history.goBack();
                }
            } else {
                window.Email.send({
                    SecureToken: "6475cd94-e35b-4580-a64e-0bb45672fa5c",
                    To: "alexander1vinet@gmail.com",
                    From: "alexander1vinet@gmail.com",
                    Subject: "Nuevo artista en canción - Herramientas para Misa",
                    Body: `<html><h2>User:</h2><p>id: ${userId}</p><h2>Song: </h2><p>${JSON.stringify(
                        newAuthor,
                        null,
                        "\t"
                    )}</p></html>`,
                }).then((message) => {
                    if (message === "OK") {
                        M.toast({ html: "Solicitud de artista enviada. Gracias!" });
                    } else {
                        M.toast({ html: "Error de solicitud de artista: " + message });
                    }
                });

                setFormStep("FINISHED");
                history.goBack();
            }
        }
    }, [formStep, authorForm, userId, authorStatus, dispatch, history]);


    return { songForm, isLoading, error, formStep, nextStep, setField, authorItems, authorForm, setAuthorField, toogleEditOnlyChords, chords, onlyLiric, chordLang, editOnlyChords };
};
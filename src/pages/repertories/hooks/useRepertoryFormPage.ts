import M from "materialize-css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	createSong,
	editSong,
	getSong,
	resetSongRequestStatus,
} from "../../../clases/song/actions";
import { MAX_RETRYS } from "../../../configs";
import {
	getDataFromRandomLyric,
	getFormattedLyric,
} from "../../../utils/lyricsAndChordsUtils";

export const useRepertoryFormPage = (songId) => {
	const dispatch = useDispatch();

	const [repertoryForm, setRepertoryForm] = useState({
		creator: null,
		title: "",
		placeTitle: "",
		placeUbication: "",
		annotations: "",
		members: [],
		isMass: false,
		songSections: [
			{
				name: "",
				songs: [],
			},
		],
	});
	const [status, setRepertoryFormStatus] = useState("INITIAL");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const userId = useSelector((state) => state.user?.google?.id);
	const userName = useSelector((state) => state.user?.google?.name);
	const { song, songRequestStatus, songError } = useSelector(
		(state) => state.song
	);
	const [retrys, setRetrys] = useState(0);

	const [formStep, setFormStep] = useState("INITIAL");
	const [onlyLiric, setOnlyLyric] = useState("");
	const [chords, setChords] = useState("");
	const [chordLang, setChordLang] = useState({});
	const [editOnlyChords, setEditOnlyChords] = useState(false);
	const navigate = useNavigate();

	const setStatus = (newStatus) => {
		// console.log("ACA SONG_FORM_STATUS: ", newStatus);
		setRepertoryFormStatus(newStatus);
	};

	useEffect(() => {
		setIsLoading(status !== "FINISHED");
	}, [status]);

	useEffect(() => {
		if (songError) setError(songError);
	}, [songError]);

	useEffect(() => {
		setStatus("1_SONG");
	}, []);

	useEffect(() => {
		if (status === "1_SONG") {
			if (!songId) {
				setStatus("FINISHED");
				setFormStep("DESCRIPTION");
			} else if (song.id === songId) {
				setRepertoryForm({ ...song });
				setRetrys(0);
				setStatus("FINISHED");
				setFormStep("DESCRIPTION");
			} else if (retrys < MAX_RETRYS) {
				setStatus("1_FETCH_SONG");
				setRetrys(retrys + 1);
			} else {
				setError("Sin conexión, pruebe recargando la página.");
				setStatus("FINISHED");
			}
		}
	}, [status, song, songId, retrys]);

	useEffect(() => {
		if (status === "1_FETCH_SONG") {
			if (songRequestStatus === "INITIAL") {
				dispatch(getSong({ userId, songId }));
			} else if (songRequestStatus === "SUCCESS") {
				setStatus("1_SONG");
				dispatch(resetSongRequestStatus());
				setError(null);
			} else if (songRequestStatus === "FAILURE") {
				setStatus("FINISHED");
				dispatch(resetSongRequestStatus());
			}
		}
	}, [status, songRequestStatus, userId, songId, dispatch]);

	const nextStep = (e) => {
		e.preventDefault();

		if (formStep === "DESCRIPTION") {
			setFormStep("LYRIC_CHORDS");
		} else if (formStep === "LYRIC_CHORDS") {
			setFormStep("EXTRA_DETAILS");
		} else if (formStep === "EXTRA_DETAILS") {
			// Validate
			setRepertoryForm((lastSongForm) => ({
				...lastSongForm,
				creator: {
					name: lastSongForm?.creator?.name || userName,
					id: lastSongForm?.creator?.id || userId,
				},
			}));

			setFormStep("SUBMIT_SONG_FORM");
		}
	};

	const isNextDisabled = () => {
		if (formStep === "DESCRIPTION") {
			return !repertoryForm.title;
		} else if (formStep === "LYRIC_CHORDS") {
			return false;
		} else if (formStep === "EXTRA_DETAILS") {
			return false;
		} else {
			return false;
		}
	};

	const setField = (field, value) => {
		setRepertoryForm((lastSongForm) => ({
			...lastSongForm,
			[field]: value,
		}));
	};

	const toogleEditOnlyChords = () => {
		if (editOnlyChords === true) {
			setField("lyric", getFormattedLyric(onlyLiric, chords));
		} else {
			const {
				chords: chordsNew,
				chordLangFound: chordLangNew,
				onlyLyric: onlyLyricNew,
			} = getDataFromRandomLyric(repertoryForm.lyric);
			setChords(chordsNew);
			setChordLang(chordLangNew);
			setOnlyLyric(onlyLyricNew);
		}

		setEditOnlyChords(!editOnlyChords);
	};

	useEffect(() => {
		if (formStep === "SUBMIT_SONG_FORM") {
			const saveAsPublic = false;

			if (songId) {
				if (songRequestStatus === "INITIAL") {
					dispatch(editSong(repertoryForm, saveAsPublic));
				} else if (songRequestStatus === "SUCCESS") {
					M.toast({ html: "Canción Actualizada" });
					dispatch(resetSongRequestStatus());
					setFormStep("FINISHED");
					navigate(-1);
				} else if (songRequestStatus === "FAILURE") {
					setFormStep("FINISHED");
					M.toast({ html: "Error actualizando la canción" });
					dispatch(resetSongRequestStatus());
					navigate(-1);
				}
			} else {
				if (songRequestStatus === "INITIAL") {
					dispatch(createSong(repertoryForm, saveAsPublic));
				} else if (songRequestStatus === "SUCCESS") {
					M.toast({ html: "Canción Guardada" });
					dispatch(resetSongRequestStatus());

					setFormStep("FINISHED");
					navigate(-1);
				} else if (songRequestStatus === "FAILURE") {
					setFormStep("FINISHED");
					M.toast({ html: "Error guardando la canción" });
					dispatch(resetSongRequestStatus());
					navigate(-1);
				}
			}
		}
	}, [
		formStep,
		repertoryForm,
		userName,
		songId,
		songRequestStatus,
		dispatch,
		navigate,
	]);

	return {
		repertoryForm,
		isLoading,
		error,
		formStep,
		nextStep,
		isNextDisabled,
		setField,
		toogleEditOnlyChords,
		chords,
		onlyLiric,
		chordLang,
		editOnlyChords,
	};
};

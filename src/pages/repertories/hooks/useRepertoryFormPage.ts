import M from "materialize-css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	createSong,
	editSong,
	getSong,
	resetSongRequestStatus,
} from "../../../classes/song/actions";
import { MAX_RETRYS } from "../../../configs";
import {
	getDataFromRandomLyric,
	getFormattedLyric,
} from "../../../utils/lyricsAndChordsUtils";
import { TStoreState } from "../../../store";
import { FETCH_STATUS } from "../../../utils/types";

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

	type IStep = "INITIAL" | "SONG_1" | "FETCH_SONG_1" | "FINISHED";
	const steps: Record<IStep, IStep> = {
		INITIAL: "INITIAL",
		SONG_1: "SONG_1",
		FETCH_SONG_1: "FETCH_SONG_1",
		FINISHED: "FINISHED",
	};
	const [step, setRepertoryFormStep] = useState<IStep>(steps.INITIAL);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const userId = useSelector((state: TStoreState) => state.user?.google?.id);
	const userName = useSelector(
		(state: TStoreState) => state.user?.google?.name
	);
	const { song, songRequestStatus, songError } = useSelector(
		(state: TStoreState) => state.song
	);
	const [retrys, setRetrys] = useState(0);

	type IFormStep =
		| "INITIAL"
		| "DESCRIPTION"
		| "LYRIC_CHORDS"
		| "EXTRA_DETAILS"
		| "SUBMIT_SONG_FORM"
		| "FINISHED";
	const formSteps: Record<IFormStep, IFormStep> = {
		INITIAL: "INITIAL",
		DESCRIPTION: "DESCRIPTION",
		LYRIC_CHORDS: "LYRIC_CHORDS",
		EXTRA_DETAILS: "EXTRA_DETAILS",
		SUBMIT_SONG_FORM: "SUBMIT_SONG_FORM",
		FINISHED: "FINISHED",
	};
	const [formStep, setFormStep] = useState<IFormStep>(formSteps.INITIAL);
	const [onlyLiric, setOnlyLyric] = useState("");
	const [chords, setChords] = useState("");
	const [chordLang, setChordLang] = useState({});
	const [editOnlyChords, setEditOnlyChords] = useState(false);
	const navigate = useNavigate();

	const setStep = (newStatus: IStep) => {
		// console.log("ACA SONG_FORM_STATUS: ", newStatus);
		setRepertoryFormStep(newStatus);
	};

	useEffect(() => {
		setIsLoading(step !== steps.FINISHED);
	}, [step]);

	useEffect(() => {
		if (songError) setError(songError);
	}, [songError]);

	useEffect(() => {
		setStep(steps.SONG_1);
	}, []);

	useEffect(() => {
		if (step === steps.SONG_1) {
			if (!songId) {
				setStep(steps.FINISHED);
				setFormStep(formSteps.DESCRIPTION);
			} else if (song.id === songId) {
				setRepertoryForm({ ...song });
				setRetrys(0);
				setStep(steps.FINISHED);
				setFormStep(formSteps.DESCRIPTION);
			} else if (retrys < MAX_RETRYS) {
				setStep(steps.FETCH_SONG_1);
				setRetrys(retrys + 1);
			} else {
				setError("Sin conexión, pruebe recargando la página.");
				setStep("FINISHED");
			}
		}
	}, [step, song, songId, retrys]);

	useEffect(() => {
		if (step === steps.FETCH_SONG_1) {
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				dispatch(getSong({ userId, songId }));
			} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
				setStep(steps.SONG_1);
				dispatch(resetSongRequestStatus());
				setError(null);
			} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
				setStep(steps.FINISHED);
				dispatch(resetSongRequestStatus());
			}
		}
	}, [step, songRequestStatus, userId, songId, dispatch]);

	const nextStep = (e) => {
		e.preventDefault();

		if (formStep === formSteps.DESCRIPTION) {
			setFormStep(formSteps.LYRIC_CHORDS);
		} else if (formStep === formSteps.LYRIC_CHORDS) {
			setFormStep(formSteps.EXTRA_DETAILS);
		} else if (formStep === formSteps.EXTRA_DETAILS) {
			// Validate
			setRepertoryForm((lastSongForm) => ({
				...lastSongForm,
				creator: {
					name: lastSongForm?.creator?.name || userName,
					id: lastSongForm?.creator?.id || userId,
				},
			}));

			setFormStep(formSteps.SUBMIT_SONG_FORM);
		}
	};

	const isNextDisabled = () => {
		if (formStep === formSteps.DESCRIPTION) {
			return !repertoryForm.title;
		} else if (formStep === formSteps.LYRIC_CHORDS) {
			return false;
		} else if (formStep === formSteps.EXTRA_DETAILS) {
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
		if (formStep === formSteps.SUBMIT_SONG_FORM) {
			const saveAsPublic = false;

			if (songId) {
				if (songRequestStatus === FETCH_STATUS.INITIAL) {
					dispatch(editSong(repertoryForm, saveAsPublic));
				} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
					M.toast({ html: "Canción Actualizada" });
					dispatch(resetSongRequestStatus());
					setFormStep(formSteps.FINISHED);
					navigate(-1);
				} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
					setFormStep(formSteps.FINISHED);
					M.toast({ html: "Error actualizando la canción" });
					dispatch(resetSongRequestStatus());
					navigate(-1);
				}
			} else {
				if (songRequestStatus === FETCH_STATUS.INITIAL) {
					dispatch(createSong(repertoryForm, saveAsPublic));
				} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
					M.toast({ html: "Canción Guardada" });
					dispatch(resetSongRequestStatus());

					setFormStep(formSteps.FINISHED);
					navigate(-1);
				} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
					setFormStep(formSteps.FINISHED);
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

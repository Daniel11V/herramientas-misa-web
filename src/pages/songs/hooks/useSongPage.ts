import { useState, useEffect, useCallback } from "react";
import M from "materialize-css";
import { useSong } from "../../../classes/song/useSong";
import { getAuthorList } from "../../../classes/author/actions";
import { setSongPageBackup } from "../../../classes/page/actions";
import { saveSongOptions } from "../../../classes/song/actions";
import { useAppDispatch, useAppSelector } from "../../../store";

const emptySong = {
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
		general: 0, // Required
	},
	annotations: "",
	tone: "",
	pulse: "",
	tempo: "",
	lyric: "",
};

export const useSongPage = (songTitleId: string) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector((state) => state.user.google.id);
	const { authorList } = useAppSelector((state) => state.author);
	const { song, isLoadingSong, errorSong, editSong } = useSong({
		songTitleId,
		userId,
	});
	const [currentSong, setCurrentSong] = useState(emptySong);

	const [isNewSong, setIsNewSong] = useState(false);
	const [songEdited, setSongEdited] = useState(false);
	const [areNewSongOptions, setAreNewSongOptions] = useState(false);

	const [tone, setCurrentTone] = useState(null); // Aca siempre en Cifrado Americano
	const [annotations, setCurrentAnnotations] = useState("");
	const [level, setCurrentLevel] = useState({ general: null });

	const [savingSongEdit, setSavingSongEdit] = useState(false);

	const setAnnotationsBackup = () => {
		dispatch(setSongPageBackup({ annotations }));
	};

	const setTone = (newTone) => {
		if (newTone) {
			setCurrentTone(newTone);
			dispatch(setSongPageBackup({ tone: newTone }));
		}
	};
	const setLevel = (category, newCatLevel) => {
		const newLevel = { ...level, [category]: newCatLevel };
		setCurrentLevel(newLevel);
		dispatch(setSongPageBackup({ level: newLevel }));
	};

	useEffect(
		() => () => {
			dispatch(saveSongOptions());
		},
		[dispatch]
	);

	const handleClickSaveSong = () => {
		console.log("ACA save", {
			...songForm,
			author: {
				name: songForm.author.name,
				id:
					authorList?.find(
						(authorSearch) => authorSearch.name === songForm.author.name
					)?.id || new Date().getTime(),
			},
		});
		editSong({
			songEdited: {
				...songForm,
				author: {
					name: songForm.author.name,
					id:
						authorList?.find(
							(authorSearch) => authorSearch.name === songForm.author.name
						)?.id || new Date().getTime(),
				},
			},
		});
		setSavingSongEdit(true);
	};

	useEffect(() => {
		if (!!savingSongEdit && !isLoadingSong) {
			setSavingSongEdit(false);
			setAreNewSongOptions(false);
			M.toast({ html: "Guardado con exito." });
		}
	}, [savingSongEdit, isLoadingSong]);

	// isEditing
	const [editingSong, setEditingSong] = useState(false);
	const [authorInstance, setAuthorInstance] = useState<M.Autocomplete | null>(
		null
	);
	const [songForm, setSongForm] = useState(emptySong);

	useEffect(() => {
		if (!editingSong && !!song?.title && !currentSong?.title)
			setCurrentSong({ ...song });
		if (editingSong && !!song?.title && !songForm?.title)
			setSongForm({ ...song });
	}, [editingSong, song, currentSong, songForm]);

	const editForm = useCallback((key, value) => {
		if (key === "author") {
			setSongForm((v) => ({ ...v, [key]: { name: value, id: null } }));
		} else {
			setSongForm((v) => ({ ...v, [key]: value }));
		}
		console.log("ACA editForm: ", { key, value });
	}, []);

	useEffect(() => {
		if (
			editingSong &&
			!authorInstance &&
			!!songForm?.author?.name &&
			!songForm?.author?.id
		) {
			console.log("useEffect authorInstance", authorInstance);
			const autocompleteDiv = document.querySelector(".autocomplete");
			const autocompleteInst = !(autocompleteDiv instanceof HTMLDivElement)
				? null
				: M.Autocomplete.init(autocompleteDiv, {
						onAutocomplete: (authorName) => {
							editForm("author", authorName);
						},
						limit: 20,
				  });
			setAuthorInstance(autocompleteInst);
			dispatch(getAuthorList({ userId }));
		}
	}, [editingSong, authorInstance, songForm, dispatch, userId, editForm]);

	useEffect(() => {
		if (authorList?.length && !!authorInstance) {
			authorInstance.updateData(
				authorList.reduce(
					(allAuthors, author) => ({ ...allAuthors, [author?.name]: null }),
					{}
				)
			);
		}
	}, [authorList, authorInstance]);

	const toogleEditBtn = () => {
		if (!editingSong) {
			editForm("annotations", annotations);
			editForm("tone", tone);
		} else {
			setCurrentAnnotations(songForm.annotations);
			setAnnotationsBackup(songForm.annotations);
			setTone(songForm.tone); // Me falta cambiarle a "en", realizarlo en el form
			if (isNewSong) {
			}
		}
		setEditingSong((lv) => !lv);
		// navigate(`/edit-song/${id}`, { state: { from: "Canción" } });
	};

	return {
		song: currentSong,
		isLoadingPage: isLoadingSong,
		errorPage: errorSong,
		tone,
		setTone,
		annotations,
		setAnnotations: setCurrentAnnotations,
		setAnnotationsBackup,
		level,
		setLevel,
		areNewSongOptions,
		songEdited,
		handleClickSaveSong,

		toogleEditBtn,
		editingSong,
		songForm,
		editForm,
	};
};

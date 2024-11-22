import { useState, useEffect, useCallback } from "react";
import M from "materialize-css";
import { useSong } from "../../../classes/song/useSong";
import { getAuthorList } from "../../../classes/author/actions";
import { saveSongOptions } from "../../../classes/song/actions";
import { TChordString } from "../types.d";
import { TSong, TSongLevel } from "../../../classes/song/types.d";
import { TRootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { setSongPageBackup } from "../../../classes/page/reducers";

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
	tone: undefined,
	pulse: "",
	tempo: "",
	lyric: "",
};

export const useSongPage = (songTitleId: string | undefined) => {
	const dispatch = useAppDispatch();
	const userId = useSelector((state: TRootState) => state.user.google.id);
	const authorList = useSelector((state: TRootState) => state.author.authorList);
	const { song, isLoadingFetchSong, isLoadingEditSong, errorSong, editSong } = useSong({
		songTitleId,
		userId,
	});
	const [currentSong, setCurrentSong] = useState<TSong>(emptySong);

	const [isNewSong, setIsNewSong] = useState(false);
	const [songEdited, setSongEdited] = useState(false);
	const [areNewSongOptions, setAreNewSongOptions] = useState(false);

	const [tone, setCurrentTone] = useState<null|TChordString>(null); // Aca siempre en Cifrado Americano
	const [annotations, setCurrentAnnotations] = useState("");
	const [level, setCurrentLevel] = useState<TSongLevel>({ general: 0 });

	const [savingSongEdit, setSavingSongEdit] = useState(false);

	const setAnnotationsBackup = () => {
		dispatch(setSongPageBackup({songPageBackup: { annotations }}));
	};

	const setTone = (newTone?: TChordString) => {
		if (newTone) {
			setCurrentTone(newTone);
			dispatch(setSongPageBackup({songPageBackup: { tone: newTone }}));
		}
	};
	const setLevel = (category: string, newCatLevel: number) => {
		const newLevel: TSongLevel = { ...level, [category]: newCatLevel };
		setCurrentLevel(newLevel);
		dispatch(setSongPageBackup({songPageBackup:{ level: newLevel }}));
	};

	useEffect(
		() => () => {
			dispatch(saveSongOptions());
		},
		[dispatch]
	);

	const handleClickSaveSong = () => {
		// console.log("ACA save", {
		// 	...songForm,
		// 	author: {
		// 		name: songForm.author.name,
		// 		id:
		// 			authorList?.find?.(
		// 				(authorSearch) => authorSearch.name === songForm.author.name
		// 			)?.id || new Date().getTime(),
		// 	},
		// });
		const hasAuthor = !!songForm.author?.name
		editSong({
			...songForm,
			author: !hasAuthor ? undefined : {
				name: songForm.author!.name,
				id: songForm.author?.id || `${new Date().getTime()}`,
			},
		});
		setSavingSongEdit(true);
	};

	useEffect(() => {
		if (!!savingSongEdit && !isLoadingEditSong) {
			setSavingSongEdit(false);
			setAreNewSongOptions(false);
			M.toast({ html: "Guardado con exito." });
		}
	}, [savingSongEdit, isLoadingEditSong]);

	// isEditing
	const [editingSong, setEditingSong] = useState(false);
	const [authorInstance, setAuthorInstance] = useState<M.Autocomplete | null>(
		null
	);
	const [songForm, setSongForm] = useState<Partial<TSong>>(emptySong);

	useEffect(() => {
		if (!editingSong && !!song?.title && !currentSong?.title)
			setCurrentSong({ ...song });
		if (editingSong && !!song?.title && !songForm?.title)
			setSongForm({ ...song });
	}, [editingSong, song, currentSong, songForm]);

	const editForm = useCallback((key: string, value: any) => {
		if (key === "author") {
			setSongForm((v) => ({ ...v, [key]: { name: value, id: '' } }));
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
			dispatch(getAuthorList())
		}
	}, [editingSong, authorInstance, songForm, dispatch, userId, editForm]);

	useEffect(() => {
		if (authorList?.length && !!authorInstance) {
			authorInstance.updateData(
				Object.values(authorList || {}).reduce(
					(allAuthors, author) => ({ ...allAuthors, [author?.name]: null }),
					{}
				)
			);
		}
	}, [authorList, authorInstance]);

	const toogleEditBtn = () => {
		if (!editingSong) {
			editForm("annotations", annotations);
			editForm("tone", tone || '');
		} else {
			setCurrentAnnotations(songForm.annotations ?? '');
			setAnnotationsBackup();
			setTone(songForm.tone); // Me falta cambiarle a "en", realizarlo en el form
			if (isNewSong) {
			}
		}
		setEditingSong((lv) => !lv);
		// navigate(`/edit-song/${id}`, { state: { from: "Canción" } });
	};

	return {
		song: currentSong,
		isLoadingPage: isLoadingFetchSong || isLoadingEditSong,
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

import M from "materialize-css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongPageOptions } from "../../../classes/user/actions";
import { objsAreEqual } from "../../../utils/lyricsAndChordsUtils";
import { TStoreState } from "../../../store";

export const useSongPageOptions = () => {
	const dispatch = useDispatch();
	const { songPageOptions } = useSelector(
		(state: TStoreState) => state.user.config
	);

	const [areNewOptions, setAreNewOptions] = useState(false);
	const [pageOptions, setPageOptions] = useState(songPageOptions);

	const setPageOptionsField = (field, newVal) => {
		setPageOptions((lv) => {
			if (lv[field] !== newVal) {
				const newPageOptions = {
					...lv,
					[field]: newVal,
				};

				setAreNewOptions(!objsAreEqual(songPageOptions, newPageOptions));

				return newPageOptions;
			} else {
				return lv;
			}
		});
	};

	const setFontSize = (newVal) => {
		setPageOptionsField("fontSize", newVal);
	};

	const toggleShowChords = () => {
		setPageOptionsField("showChords", !pageOptions.showChords);
	};

	const setChordLang = (newVal) => {
		setPageOptionsField("chordLang", newVal);
	};

	const chordLangOptions = {
		Cifrados: [
			{ value: "en", label: "Americano" },
			{ value: "es", label: "Español" },
		],
	};

	const saveOptions = () => {
		dispatch(setSongPageOptions(pageOptions));
		setAreNewOptions(false);
		M.toast({ html: "Configuración Actualizada." });
	};

	return {
		areNewOptions,
		pageOptions,
		setFontSize,
		toggleShowChords,
		setChordLang,
		chordLangOptions,
		saveOptions,
	};
};

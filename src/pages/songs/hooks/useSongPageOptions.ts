import M from "materialize-css";
import { useState } from "react";
import { setSongPageOptions } from "../../../classes/user/actions";
import { useAppSelector } from "../../../store";
import { objsAreEqual } from "../../../utils/generalUtils";
import { useDispatch } from "react-redux";

export const useSongPageOptions = () => {
	const dispatch = useDispatch();
	const { songPageOptions } = useAppSelector((state) => state.user.config);

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

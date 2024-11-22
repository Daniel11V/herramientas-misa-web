import M from "materialize-css";
import { useState } from "react";
import { objsAreEqual } from "../../../utils/generalUtils";
import { TModalSelectorOpts } from "../components/ModalSelector";
import { TChordLang } from "../types.d";
import { TRootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { setUserSongPageOptions } from "../../../classes/user/reducers";

export type TSongPageOptionsKeys = 'fontSize'|'showChords'|'chordLang'

export const useSongPageOptions = () => {
	const dispatch = useAppDispatch();
	const songPageOptions = useSelector((state: TRootState) => state.user.config.songPageOptions);

	const [areNewOptions, setAreNewOptions] = useState(false);
	const [pageOptions, setPageOptions] = useState(songPageOptions);

	const setPageOptionsField = (field: TSongPageOptionsKeys, newVal: unknown) => {
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

	const setFontSize = (newVal: number) => {
		setPageOptionsField("fontSize", newVal);
	};

	const toggleShowChords = () => {
		setPageOptionsField("showChords", !pageOptions.showChords);
	};

	const setChordLang = (newVal: TChordLang) => {
		setPageOptionsField("chordLang", newVal);
	};

	const chordLangOptions: TModalSelectorOpts = [
		{
			type: "Cifrados",
			options: [
				{ value: "en", label: "Americano" },
				{ value: "es", label: "Español" },
			],
		}
	]

	const saveOptions = () => {
		dispatch(setUserSongPageOptions({songPageOptions: pageOptions}));
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

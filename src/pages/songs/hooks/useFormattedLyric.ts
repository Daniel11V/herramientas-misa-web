import { useCallback, useEffect, useState } from "react";
import {
	getDataFromRandomLyric,
	getFormattedLyric,
	translateChord,
	translateChords,
	transposeChords,
} from "../../../utils/lyricsAndChordsUtils";

export const useFormattedLyric = ({
	lyricWithChords,
	setLyricWithChords,
	setLyricWithChordsEN,
	userTone,
	setUserTone,
	userChordLang,
	onlyInputText,
	isEditable,
}) => {
	// const [isLoadingLyric, setIsLoading] = useState(false);
	// const [errorLyric, setError] = useState(false);

	const [lastChordLang, setLastChordLang] = useState(null);

	const [chords, setChords] = useState({});
	const [tone, setTone] = useState(null);
	const [chordLang, setChordLang] = useState(null);
	const [arrayLyric, setArrayLyric] = useState([]);
	const [onlyLyric, setOnlyLyric] = useState("");

	const saveLyricWithChords = useCallback(
		(lyricToSave, newOnlyLyric = null, newChords = null) => {
			if (setLyricWithChords) {
				setLyricWithChords(
					lyricToSave ||
						getFormattedLyric(newOnlyLyric || onlyLyric, newChords || chords)
				);
			}
			if (setLyricWithChordsEN) {
				setLyricWithChordsEN(
					lyricToSave ||
						getFormattedLyric(
							newOnlyLyric || onlyLyric,
							translateChords(newChords || chords, "en", chordLang)
						)
				);
			}
		},
		[setLyricWithChords, setLyricWithChordsEN, onlyLyric, chords, chordLang]
	);

	useEffect(() => {
		if (!onlyInputText && !!lyricWithChords && !arrayLyric.length) {
			// Por ahora que en la BBDD tengo acordes sin formatear se queda en Random, sino aca recibiria formateado
			const {
				newOnlyLyric,
				newArrayLyric,
				newChords,
				chordLangFound,
				chordToneFound,
			} = getDataFromRandomLyric(lyricWithChords);

			console.log("useEffect getDataFromRandomLyric", {
				lyricWithChords,
				newOnlyLyric,
				newArrayLyric,
				newChords,
				chordLangFound,
				chordToneFound,
			});

			// CASO Crear cancion en (!onlyInputText && isEditable):
			// - lyricWithChords viene de input
			// - getLyricsAndChordsFromRandom mismo lang y tone
			// CASO Abrir cancion (!onlyInputText && !isEditable):
			// - lyricWithChords viene de BBDD
			// - getLyricsAndChordsFromRandom(por ahora) traducir y cambiar tono
			// - ir guardando setLyricWithChords(formattedLyric traducido y tono)
			// CASO Editar cancion (onlyInputText && isEditable):
			// - lyricWithChords viene de Abrir(formattedLyric traducido y tono)
			// - ningun cambio
			// CASO Editar cancion (!onlyInputText && isEditable):
			// - lyricWithChords viene de input
			// - getLyricsAndChordsFromRandom mismo lang y tone (aunque se puede evaluar)

			setOnlyLyric(newOnlyLyric);
			setArrayLyric(newArrayLyric);
			if (!isEditable) {
				const transposedChords = transposeChords(
					newChords,
					userTone,
					chordToneFound,
					chordLangFound
				);
				setTone(userTone || chordToneFound);
				const translatedChords = translateChords(
					transposedChords,
					userChordLang,
					chordLangFound
				);
				setChordLang(userChordLang || chordLangFound);
				setChords(translatedChords);
			} else {
				setChords(newChords);
				setTone(chordToneFound);
				setChordLang(chordLangFound);
			}

			saveLyricWithChords(null, newOnlyLyric, newChords);

			// ? setLastChordLang(userChordLang || chordLangFound);
		}
	}, [
		onlyInputText,
		isEditable,
		lyricWithChords,
		arrayLyric,
		userChordLang,
		userTone,
		saveLyricWithChords,
	]);

	// useEffect(() => {
	//     if (!!lyricWithChords && !lastLyricWithChords) {
	//         console.log("useEffect lastLyricWithChords", {
	//             lyricWithChords,
	//             lastLyricWithChords,
	//         });
	//         const { chords: newChords, chordLangFound, chordTone, arrayLyric: newArrayLyric, formattedLyric } =
	//             getDataFromRandomLyric(lyricWithChords);

	//         setTone(chordTone);
	//         setLastChordLang(userChordLang || chordLangFound);
	//         setChords(newChords);
	//         setArrayLyric(newArrayLyric);

	//         setLyricWithChords(formattedLyric);
	//         setLastLyricWithChords(formattedLyric);
	//     }
	// }, [lyricWithChords, userChordLang, lastLyricWithChords, setLyricWithChords]);

	useEffect(() => {
		if (!!userChordLang && userChordLang !== lastChordLang) {
			setChords((lastChords) => {
				const newCurrentChords = {};
				for (const line in lastChords)
					for (const chordIndex in lastChords[line]) {
						newCurrentChords[line] = {
							...(newCurrentChords[line] || {}),
							[chordIndex]: {
								...lastChords[line][chordIndex],
								chord: translateChord(
									lastChords[line][chordIndex].chord,
									userChordLang
								),
							},
						};
					}

				return newCurrentChords;
			});

			setLastChordLang(userChordLang);
		}
	}, [userChordLang, lastChordLang, setChords, setLastChordLang]);

	useEffect(() => {
		if (!!tone && !!userTone && userTone !== tone) {
			setChords((lastChords) =>
				transposeChords(lastChords, userTone, tone, userChordLang)
			);
			setTone(userTone);
		} else if (!userTone && !!tone) {
			setUserTone(tone);
		}
	}, [userTone, tone, userChordLang, setUserTone]);

	// useEffect(() => {
	// 	setHasChords(hasChords);
	// }, [hasChords, setHasChords]);

	// useEffect(() => {
	// 	setArrayLyric(onlyLyric.split("\n").map((p) => (p ? p.split("") : [""])));
	// 	setSelectedChord(userChordLang === "en" ? "C" : "DO");
	// }, [onlyLyric, userChordLang]);

	// useEffect(() => {
	// 	if (setChords !== null) setIsEditable(true);
	// 	else setIsEditable(false);
	// }, [setChords]);

	const addChord = (chordIndex, chord) => {
		const newChords = { ...chords };
		newChords[chordIndex[0]][chordIndex[1]] = chord;

		setChords(newChords);
		saveLyricWithChords(null, null, newChords);
	};

	const removeChord = (chordIndex) => {
		const newChords = { ...chords };
		delete newChords[chordIndex[0]][chordIndex[1]];
		if (!Object.keys(newChords[chordIndex[0]]).length)
			delete newChords[chordIndex[0]];

		setChords(newChords);
		saveLyricWithChords(null, null, newChords);
	};

	return {
		arrayLyric,
		chords,
		chordLang,
		tone,
		addChord,
		removeChord,
		saveLyricWithChords,
	};
};

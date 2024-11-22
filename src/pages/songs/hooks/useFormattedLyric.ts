import { useCallback, useEffect, useState } from "react";
import {
	getDataFromRandomLyric,
	getFormattedLyric,
	translateChord,
	translateChords,
	transposeChords,
} from "../../../utils/lyricsAndChordsUtils";
import { TChord, TChordInLyric, TChordLang, TChordString, TLetterIndex } from "../types.d";

export const useFormattedLyric = (p: {
	lyricWithChords?: string,
	setLyricWithChords: (l: string) => void,
	setLyricWithChordsEN?: (l: string) => void,
	userTone: null|TChordString,
	setUserTone: (tone: TChordString) => void,          
	userChordLang: TChordLang,
	isEditable: boolean,
	onlyInputText: boolean,
}) => {
	const {
		lyricWithChords,
		setLyricWithChords,
		setLyricWithChordsEN,
		userTone,
		setUserTone,
		userChordLang,
		onlyInputText,
		isEditable,
	} = p;
	// const [isLoadingLyric, setIsLoading] = useState(false);
	// const [errorLyric, setError] = useState(false);

	const [lastChordLang, setLastChordLang] = useState<TChordLang|null>(null);

	const [chords, setChords] = useState<TChordInLyric>({});
	const [tone, setTone] = useState<TChordString|null>(null);
	const [chordLang, setChordLang] = useState<TChordLang|null>(null);
	const [arrayLyric, setArrayLyric] = useState<string[][][]>([]);
	const [onlyLyric, setOnlyLyric] = useState<string>("");

	const saveLyricWithChords = useCallback(
		(lyricToSave: string|null, newOnlyLyric: string|null = null, newChords: TChordInLyric|null = null) => {
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
		if (!onlyInputText && !!lyricWithChords && !arrayLyric.length && userTone) {
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
					chordLangFound ?? undefined
				);
				setTone(userTone || chordToneFound);
				const translatedChords = translateChords(
					transposedChords,
					userChordLang,
					chordLangFound
				);
				setChordLang(userChordLang || chordLangFound);
				if (translatedChords) setChords(translatedChords);
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
				const newCurrentChords: TChordInLyric = {};
				for (const line in lastChords)
					for (const chordIndex in lastChords[line]) {
						newCurrentChords[line][chordIndex] = {
							...lastChords[line][chordIndex],
							chord: translateChord(
								lastChords[line][chordIndex].chord,
								userChordLang
							),
						}
					}

				return newCurrentChords;
			});

			setLastChordLang(userChordLang);
		}
	}, [userChordLang, lastChordLang, setChords, setLastChordLang]);

	useEffect(() => {
		if (!!tone && !!userTone && userTone !== tone) {
			setChords((lastChords) => transposeChords(lastChords, userTone, tone, userChordLang) ?? {});
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

	const addChord = (chordIndex: TLetterIndex, chord: TChord) => {
		const newChords = { ...chords };
		newChords[chordIndex[0]][chordIndex[1]] = chord;

		setChords(newChords);
		saveLyricWithChords(null, null, newChords);
	};

	const removeChord = (chordIndex: TLetterIndex) => {
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

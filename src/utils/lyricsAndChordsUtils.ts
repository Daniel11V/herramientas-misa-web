import allChords, {
	replaceBemols,
	chordToES,
	allChordsArrayEN,
	allChordsArrayES,
	chordToEN,
} from "../data/allChords.js";
import { CHORD_LANGS, TChordInLyric, TChordLang, TChordString, TChordStringEN, TChordStringES } from "../pages/songs/types.d";

// Lyrics and Chords

export const getModuleToneDiference = (a: number, b: number) => {
	const difference = (a - b) * -1;
	if (difference < 0) return 12 + difference;
	return difference;
};

export const getChordIndex = (chord: TChordString, chordLang: TChordLang = CHORD_LANGS.EN) => {
	// In allChords
	for (let i = 0; i < allChords[chordLang].length; i++)
		for (let k = 0; k < allChords[chordLang][i].chords.length; k++)
			if (!allChords[chordLang][i].chords[k].localeCompare(chord))
				return [i, k];
};

export const oldTranslateChord = (chord: TChordString, toLang: TChordLang, currentLang?: TChordLang) => {
	if (currentLang === toLang) return chord;
	if (!!chord && toLang === CHORD_LANGS.ES) return chordToES[chord as TChordStringEN];
	const fromLang = toLang === CHORD_LANGS.EN ? CHORD_LANGS.ES : CHORD_LANGS.EN;
	for (let i = 0; i < allChords?.[fromLang]?.length; i++) {
		const chordIndex = allChords[fromLang][i].chords.findIndex(
			(bookedChord) => bookedChord.toUpperCase() === chord.toUpperCase()
		);
		if (chordIndex >= 0) return allChords[toLang][i].chords[chordIndex];
	}
	return chord;
};

export const translateChord = (chord: TChordString, toLang: TChordLang, currentLang?: TChordLang|null): TChordString => {
	if (currentLang === toLang || !chord) return chord;
	return toLang === CHORD_LANGS.ES ? chordToES[chord as TChordStringEN] : chordToEN[chord as TChordStringES];
};

export const translateChords = (chords: TChordInLyric|undefined, toLang: TChordLang, currentLang?: TChordLang|null) => {
	if (currentLang === toLang || !chords) return chords;

	for (const line in chords) {
		for (const chordIndex in chords[line]) {
			chords[line][chordIndex].chord = translateChord(
				chords[line][chordIndex].chord,
				toLang,
				currentLang
			);
		}
	}

	return chords;
};

export const getToneDifference = (toChord: TChordString, fromChord: TChordString) => {
	const currentToneIndex = getChordIndex(fromChord);
	const toneIndex = getChordIndex(toChord);
	if (typeof currentToneIndex !== "number" || typeof toneIndex !== "number" ) return undefined
	const toneDiference = getModuleToneDiference(
		currentToneIndex[1],
		toneIndex[1]
	);
	return toneDiference;
};

export const transposeChord = (initialChord: TChordString, toneDiference:number, chordLang: TChordLang) => {
	const initialChordIndex = getChordIndex(initialChord, chordLang);
	if (initialChordIndex) {
		let newChordIndex = initialChordIndex[1] + toneDiference;
		if (newChordIndex > 11) newChordIndex = newChordIndex - 12;
		return allChords[chordLang][initialChordIndex[0]].chords[newChordIndex];
	}
};

export const transposeChords = (chords?: TChordInLyric, toTone?: TChordString, fromTone?: TChordString, chordLang?: TChordLang): undefined|TChordInLyric => {
	if (!chords || !toTone || !fromTone || !chordLang) return undefined;

	const toneDiference = getToneDifference(toTone, fromTone);
	if (toneDiference === undefined) return undefined
	for (const line in chords) {
		for (const chordIndex in chords[line]) {
			const chordTransposed = transposeChord(
				chords[line][chordIndex].chord,
				toneDiference,
				chordLang
			);
			if (chordTransposed) {
				chords[line][chordIndex].chord = chordTransposed;
			}
		}
	}

	return chords;
};

export const getFormattedLyric = (onlyLyric: string, chords?: TChordInLyric) => {
	console.log("ACA getFormattedLyric", { onlyLyric, chords });
	if (!onlyLyric || !chords) return onlyLyric;

	const formattedLyric = onlyLyric.split("\n").map((line) => line.split(""));
	for (const lineIndex in chords) {
		const charIndexes: string[] = Object.keys(chords[lineIndex]).reverse()
		for (const charIndex of charIndexes) {
			const charIndexN = Number(charIndex)
			const chordDuration = chords[lineIndex][charIndexN]?.duration
				? chords[lineIndex][charIndexN]?.duration + "|"
				: "";
			const chordString = `[${chordDuration}${chords[lineIndex][charIndexN].chord}]`;

			formattedLyric[Number(lineIndex)].splice(charIndexN, 0, chordString);
		}
	}
	console.log("ACA getFormattedLyric2", {
		onlyLyric,
		chords,
		formattedLyric: formattedLyric.map((line) => line.join("")).join("\n"),
	});
	return formattedLyric.map((line) => line.join("")).join("\n");
};

export const getLyricWithChordsOld = (onlyLyric: string, chords: TChordInLyric) => {
	let lyric = onlyLyric.split("\n");

	let numInsertedLines = 0;
	if (chords) {
		Object.keys(chords).forEach((lineIndex) => {
			const lineIndexN = Number(lineIndex)
			const lyricLineIndex = lineIndexN + numInsertedLines;
			lyric.splice(lyricLineIndex, 0, "");

			Object.keys(chords[lineIndexN]).forEach((charIndex) => {
				const numberOfSpaces = Number(charIndex) - lyric[lyricLineIndex].length;
				for (let i = 0; i < numberOfSpaces; i++) lyric[lyricLineIndex] += " ";
				lyric[lyricLineIndex] += chords[lineIndexN][Number(charIndex)];
			});

			numInsertedLines++;
		});
	}

	return lyric.join("\n");
};

export const getDataFromRandomLyric = (randomLyric: string) => {
	const newChords: TChordInLyric = {};
	const emptyReturn: { newChords: TChordInLyric, newArrayLyric: [] } = { newChords: {}, newArrayLyric: [] };
	const songLines: string[] = randomLyric.split("\n");
	let onlyLyric = [...songLines];

	let chordLangFound: TChordLang|null = null; // Normal chords
	let chordLangFound2: TChordLang|null = null; // Formatted chords
	let finalLineIndex = -1;
	songLines.forEach((currentLine) => {
		finalLineIndex++;
		let line = ` ${currentLine} `.replace(/\t/g, " ").toUpperCase();
		if (line.replace(/ /g, "") === "") return emptyReturn;

		// Quita los acordes para ver si es una linea solo de acordes, y obtiene el chordLangFound
		for (
			let i = 0;
			i < allChordsArrayEN.length && line.replace(/ /g, "") !== "";
			i++
		) {
			if (chordLangFound === null || chordLangFound === CHORD_LANGS.EN) {
				const upperChordEN = allChordsArrayEN[i];
				while (line.includes(` ${upperChordEN} `)) {
					line = line.replace(upperChordEN, "");
					if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
				}
				// Also check bemols
				if (upperChordEN.includes("#")) {
					const upperChordENbemol = Object.keys(replaceBemols.en).find(
						(bemolChord) =>
							replaceBemols.en[bemolChord].slice(0, -1) ===
							upperChordEN.split("#")[0]
					);
					while (!!upperChordENbemol && line.includes(` ${upperChordENbemol} `)) {
						line = line.replace(upperChordENbemol, "");
						if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
					}
				}
			}
			if (chordLangFound === null || chordLangFound === CHORD_LANGS.ES) {
				const upperChordES = allChordsArrayES[i];
				while (line.includes(` ${upperChordES} `)) {
					line = line.replace(` ${upperChordES} `, " ");
					if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
				}
				// Also check bemols
				if (upperChordES.includes("#")) {
					const upperChordESbemol = Object.keys(replaceBemols.es).find(
						(bemolChord) =>
							replaceBemols.es[bemolChord].slice(0, -1) ===
							upperChordES.split("#")[0]
					);
					while (!!upperChordESbemol && line.includes(` ${upperChordESbemol} `)) {
						line = line.replace(upperChordESbemol, "");
						if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
					}
				}
			}
		}

		// Si es linea de acordes, la revisa y los agrega a newChords
		if (line.replace(/ /g, "") === "") {
			const chordLine = currentLine + " ";
			let newChord = "";
			let newChordIndex: number|null = null;
			chordLine.split("").forEach((character, index) => {
				if (character !== " " && !!newChord) {
					newChord += character;
				} else if (character !== " " && !newChord) {
					newChordIndex = index;
					newChord += character;
				} else if (character === " " && !!newChord && !!newChordIndex) {
					// Replace bemol
					const replaceBemolsLang = chordLangFound ? replaceBemols[chordLangFound] : {}
					for (const bemolChord of Object.keys(replaceBemolsLang)) {
						if (newChord.toUpperCase().includes(bemolChord)) {
							newChord = newChord
								.toUpperCase()
								.replace(bemolChord, replaceBemolsLang[bemolChord]);
							break;
						}
					}
					newChords[finalLineIndex][newChordIndex] = { chord: newChord as TChordString, duration: "" }
					// if (newChords[finalLineIndex]) {
					//     newChords[finalLineIndex][newChordIndex] = translateChord(newChord, CHORD_LANGS.EN, chordLangFound);
					// } else {
					//     newChords[finalLineIndex] = {
					//         ...newChords[finalLineIndex],
					//         [newChordIndex]: translateChord(newChord, CHORD_LANGS.EN, chordLangFound)
					//     };
					// }
					newChord = "";
					newChordIndex = null;
				}
			});
			onlyLyric.splice(finalLineIndex, 1);
			finalLineIndex--;

			// Si no es linea de acorde revisa los acordes incrustrados como [2|SOL]
		} else {
			if (onlyLyric[finalLineIndex].includes("[")) {
				//const bracketsRegex = /\[[^[]]*\]/g;
				const bracketsRegex = /\[(.*?)\]/;
				// console.log("ACA4", bracketsRegex.test(onlyLyric[finalLineIndex]))
				while (
					onlyLyric[finalLineIndex].includes("[") &&
					bracketsRegex.test(onlyLyric[finalLineIndex])
				) {
					const newChordIndex = onlyLyric[finalLineIndex].indexOf("[");
					const content = onlyLyric[finalLineIndex].split("[")[1].split("]")[0];
					// console.log("ACA3", { line: onlyLyric[finalLineIndex], content })
					let [newChord, newChordDuration] = content.split("|");

					if (chordLangFound2 === null || chordLangFound2 === CHORD_LANGS.EN) {
						for (const bemolChord of Object.keys(replaceBemols[CHORD_LANGS.EN])) {
							if (newChord.toUpperCase().includes(bemolChord)) {
								newChord = newChord
									.toUpperCase()
									.replace(bemolChord, replaceBemols[CHORD_LANGS.EN][bemolChord]);
								if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
								break;
							}
						}
					}
					if (chordLangFound2 === null || chordLangFound2 === CHORD_LANGS.ES) {
						for (const bemolChord of Object.keys(replaceBemols[CHORD_LANGS.ES])) {
							if (newChord.toUpperCase().includes(bemolChord)) {
								newChord = newChord
									.toUpperCase()
									.replace(bemolChord, replaceBemols[CHORD_LANGS.ES][bemolChord]);
								if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
								break;
							}
						}
					}
					newChords[finalLineIndex][newChordIndex] = { chord: newChord as TChordString, duration: newChordDuration || "" }

					onlyLyric[finalLineIndex] = onlyLyric[finalLineIndex].replace(
						bracketsRegex,
						""
					);
				}
			}
		}
	});

	// If has chords...
	let chordToneFound = "";
	if (newChords) {
		// Find Tone
		const firstLineChords = Object.entries(newChords)?.[0]?.[1];
		chordToneFound = firstLineChords
			? Object.entries(firstLineChords)[0][1].chord
			: "";

		// Adjust if chordLine is larger
		for (const lineIndex in newChords) {
			const lineIndexNum: number = Number(lineIndex)
			if (!onlyLyric[lineIndexNum]) onlyLyric[lineIndexNum] = " ";
			for (const charIndex in newChords[lineIndexNum]) {
				const charIndexNum: number = Number(charIndex)
				const lineLength = onlyLyric[lineIndexNum].length;
				if (lineLength < charIndexNum) {
					for (let j = 0; j <= charIndexNum - lineLength; j++) {
						onlyLyric[lineIndexNum] += " ";
					}
				}
			}
		}
	}

	const newArrayLyric = onlyLyric
		.slice()
		.map((line) =>
			line
				? line.split(" ").map((word) => (word ? word.split("") : [" "]))
				: [[""]]
		);
		
	return {
		newOnlyLyric: onlyLyric.join("\n"),
		newArrayLyric,
		newChords,
		chordToneFound: chordToneFound as TChordString,
		chordLangFound: (chordLangFound || chordLangFound2) as TChordLang|null,
	}; // newChords in same chordLand that found
};

export const getDataFromRandomLyricOld = (lyric: string) => {
	const songLines = lyric.split("\n");
	const newChords = {};
	let onlyLyric = [...songLines];

	let chordLangFound: null|TChordLang = null; // Normal chords
	let chordLangFound2: null|TChordLang = null; // Formatted chords
	let finalLineIndex = -1;
	songLines.forEach((currentLine) => {
		finalLineIndex++;
		let line = (" " + currentLine + " ").replace(/\t/g, " ").toUpperCase();
		if (line.replace(/ /g, "") === "") return;

		// Quita los acordes para ver si es una linea solo de acordes, y obtiene el chordLangFound
		for (
			let i = 0;
			i < allChordsArrayEN.length && line.replace(/ /g, "") !== "";
			i++
		) {
			if (chordLangFound === null || chordLangFound === CHORD_LANGS.EN) {
				const upperChordEN = allChordsArrayEN[i].toUpperCase();
				while (line.includes(` ${upperChordEN} `)) {
					line = line.replace(upperChordEN, "");
					if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
				}
				// Also check bemols
				if (upperChordEN.includes("#")) {
					const upperChordENbemol = Object.keys(replaceBemols.en).find(
						(bemolChord) =>
							replaceBemols.en[bemolChord].slice(0, -1) ===
							upperChordEN.split("#")[0]
					);
					while (!!upperChordENbemol && line.includes(` ${upperChordENbemol} `)) {
						line = line.replace(upperChordENbemol, "");
						if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
					}
				}
			}
			if (chordLangFound === null || chordLangFound === CHORD_LANGS.ES) {
				const upperChordES = allChordsArrayES[i].toUpperCase();
				while (line.includes(` ${upperChordES} `)) {
					line = line.replace(` ${upperChordES} `, " ");
					if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
				}
				// Also check bemols
				if (upperChordES.includes("#")) {
					const upperChordESbemol = Object.keys(replaceBemols.es).find(
						(bemolChord) =>
							replaceBemols.es[bemolChord].slice(0, -1) ===
							upperChordES.split("#")[0]
					);
					while (!!upperChordESbemol && line.includes(` ${upperChordESbemol} `)) {
						line = line.replace(upperChordESbemol, "");
						if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
					}
				}
			}
		}

		// Si es linea de acordes, la revisa y los agrega a newChords
		// console.log("ACA", { line });
		if (line.replace(/ /g, "") === "") {
			const chordLine = currentLine + " ";
			let newChord = "";
			let newChordIndex: null|number = null;
			chordLine.split("").forEach((character, index) => {
				if (character !== " " && !!newChord) {
					newChord += character;
				} else if (character !== " " && !newChord) {
					newChordIndex = index;
					newChord += character;
				} else if (character === " " && !!newChord) {
					// Replace bemol
					// @ts-ignore
					for (const bemolChord of Object.keys(replaceBemols[chordLangFound])) {
						if (newChord.toUpperCase().includes(bemolChord)) {
							newChord = newChord
								.toUpperCase()
								// @ts-ignore
								.replace(bemolChord, replaceBemols[chordLangFound][bemolChord]);
							break;
						}
					}
					// @ts-ignore
					newChords[finalLineIndex][newChordIndex] = {
						// @ts-ignore
						chord: translateChord(newChord, CHORD_LANGS.EN, chordLangFound),
					},
					// if (newChords[finalLineIndex]) {
					//     newChords[finalLineIndex][newChordIndex] = translateChord(newChord, CHORD_LANGS.EN, chordLangFound);
					// } else {
					//     newChords[finalLineIndex] = {
					//         ...newChords[finalLineIndex],
					//         [newChordIndex]: translateChord(newChord, CHORD_LANGS.EN, chordLangFound)
					//     };
					// }
					newChord = "";
					newChordIndex = null;
				}
			});
			onlyLyric.splice(finalLineIndex, 1);
			finalLineIndex--;

			// Si no es linea de acorde revisa los acordes incrustrados como [chord 2|SOL]
		} else {
			if (onlyLyric[finalLineIndex].includes("[")) {
				//const bracketsRegex = /\[[^[]]*\]/g;
				const bracketsRegex = /\[(.*?)\]/;
				console.log("ACA4", bracketsRegex.test(onlyLyric[finalLineIndex]));
				while (
					onlyLyric[finalLineIndex].includes("[") &&
					bracketsRegex.test(onlyLyric[finalLineIndex])
				) {
					const newChordIndex = onlyLyric[finalLineIndex].indexOf("[");
					const content = onlyLyric[finalLineIndex].split("[")[1].split("]")[0];
					console.log("ACA3", { line: onlyLyric[finalLineIndex], content });
					let [newChord, newChordDuration] = content.split("|");

					if (chordLangFound2 === null || chordLangFound2 === CHORD_LANGS.EN) {
						for (const bemolChord of Object.keys(replaceBemols[CHORD_LANGS.EN])) {
							if (newChord.toUpperCase().includes(bemolChord)) {
								newChord = newChord
									.toUpperCase()
									.replace(bemolChord, replaceBemols[CHORD_LANGS.EN][bemolChord]);
								if (!chordLangFound) chordLangFound = CHORD_LANGS.EN;
								break;
							}
						}
					}
					if (chordLangFound2 === null || chordLangFound2 === CHORD_LANGS.ES) {
						for (const bemolChord of Object.keys(replaceBemols[CHORD_LANGS.ES])) {
							if (newChord.toUpperCase().includes(bemolChord)) {
								newChord = newChord
									.toUpperCase()
									.replace(bemolChord, replaceBemols[CHORD_LANGS.ES][bemolChord]);
								if (!chordLangFound) chordLangFound = CHORD_LANGS.ES;
								break;
							}
						}
					}
					// @ts-ignore
					newChords[finalLineIndex] = {
						// @ts-ignore
						...(newChords[finalLineIndex] || {}),
						[newChordIndex]: {
							// @ts-ignore
							chord: translateChord(newChord, CHORD_LANGS.EN, chordLangFound2),
							duration: newChordDuration || "",
						},
					};

					onlyLyric[finalLineIndex] = onlyLyric[finalLineIndex].replace(
						bracketsRegex,
						""
					);
				}
			}
		}
	});

	// If has chords, set tone
	let chordTone = "";
	if (newChords && Object.keys(newChords).length !== 0) {
		let lineToSearchChordNumber = 0;
		let firstChord;
		do {
			const lineToSearchChord =
				Object.values(newChords)[lineToSearchChordNumber];
				// @ts-ignore
			firstChord = Object.values(lineToSearchChord)[0]?.chord;
			lineToSearchChordNumber++;
		} while (
			!firstChord &&
			lineToSearchChordNumber < Object.values(newChords).length
		);

		if (!!firstChord) {
			// chordTone = translateChord(firstChord, CHORD_LANGS.EN, chordLangFound);
			const chordIndex = getChordIndex(firstChord);
			// @ts-ignore
			chordTone = allChords?.en?.[0]?.chords?.[chordIndex[1]];
		}

		// Adjust if chordLine is larger
		for (const lineIndex in newChords) {
			// @ts-ignore
			if (!onlyLyric[lineIndex]) onlyLyric[lineIndex] = " "
			// @ts-ignore;
			for (const charIndex in newChords[lineIndex]) {
				// @ts-ignore
				const lineLength = onlyLyric[lineIndex].length;
				if (lineLength < charIndex) {
					for (let j = 0; j <= Number(charIndex) - lineLength; j++) {
						// @ts-ignore
						onlyLyric[lineIndex] += " ";
					}
				}
			}
		}
	}

	const formattedLyric = getFormattedLyric(onlyLyric.join("\n"), newChords);

	const arrayLyric = onlyLyric
		.slice()
		.map((line) =>
			line
				? line.split(" ").map((word) => (word ? word.split("") : [" "]))
				: [[""]]
		);

	return {
		chords: newChords,
		chordTone,
		chordLangFound: chordLangFound || chordLangFound2,
		onlyLyric: onlyLyric.join("\n"),
		arrayLyric,
		formattedLyric,
	};
};

export const getLyricStart = (lyric: string) => {
	const bracketsRegex = /\[(.*?)\]/g;
	const numberOfLines = 4;
	const lyricStart = lyric
		.split("\n")
		.map((l) => l.replace(/\t/g, " ").replace(bracketsRegex, ""))
		.filter((l) => l.replace(/ /g, "") !== "")
		.slice(0, numberOfLines - 1)
		// .map(l => l.replaceAll(" ", "")[-1] !== "," ? l + ", " : l)
		.join(" ");

	return lyricStart;
};

export const translateFormattedLyric = (lyric: string, fromChordLang: TChordLang, toChordLang: TChordLang) => {
	if (!lyric || !toChordLang || !fromChordLang || fromChordLang === toChordLang)
		return lyric;

	const songLines = lyric.split("\n");
	const newChords: TChordInLyric = {};
	let onlyLyric = [...songLines];

	songLines.forEach((currentLine, currentLineIndex) => {
		if (currentLine.replace(/\t/g, " ").replace(/ /g, "") === "") return;

		const bracketsRegex = /\[(.*?)\]/;
		console.log("ACA4", bracketsRegex.test(onlyLyric[currentLineIndex]));
		while (
			onlyLyric[currentLineIndex].includes("[") &&
			bracketsRegex.test(onlyLyric[currentLineIndex])
		) {
			const newChordIndex = onlyLyric[currentLineIndex].indexOf("[");
			const content = onlyLyric[currentLineIndex].split("[")[1].split("]")[0];
			console.log("ACA3", { line: onlyLyric[currentLineIndex], content });
			let [newChord, newChordDuration] = content.split("|");

			for (const bemolChord of Object.keys(replaceBemols[fromChordLang])) {
				if (newChord.toUpperCase().includes(bemolChord)) {
					newChord = newChord
						.toUpperCase()
						.replace(bemolChord, replaceBemols[fromChordLang][bemolChord]);
					break;
				}
			}
			newChords[currentLineIndex][newChordIndex] = {
				chord: translateChord(newChord as TChordString, toChordLang, fromChordLang),
				duration: newChordDuration || "",
			},

			onlyLyric[currentLineIndex] = onlyLyric[currentLineIndex].replace(
				bracketsRegex,
				""
			);
		}
	});

	const formattedLyric = getFormattedLyric(onlyLyric.join("\n"), newChords);

	return formattedLyric;
};

import allChords, { replaceBemols } from "./data/allChords.js";
import searchLabels from "./data/searchLabels.js";


export const automaticLabels = (lyric, labels) => {
    const onlyLyric = lyric.split("\n").filter((p) => {
        p = p.toLowerCase();

        if (!p || p.includes("      ")) {
            return false;
        }

        let counter = 0;
        for (const key in allChords) {
            for (let chord of allChords[key]) {
                chord = chord.toLowerCase();
                if (p === chord) {
                    return false;
                }

                if (p.includes(` ${chord} `)) {
                    counter++;
                    if (p.replace(` ${chord} `, "  ").includes(` ${chord} `)) {
                        counter++;
                    }
                }
            }
        }

        if (counter >= 3) {
            return false;
        } else {
            return true;
        }
    });


    onlyLyric.forEach((p, i, thisArray) => (thisArray[i] = p.trim()));

    const manualLabel = false;

    if (!manualLabel) {
        for (const label in searchLabels) {
            for (const keyWords of searchLabels[label]) {
                if (lyric.includes(keyWords)) {
                    // console.log("Incluye: ", label);
                    if (!labels.includes(label)) {
                        labels.push(label);
                    }
                }
            }
        }
    }
}

export const objIsEmpty = (object) => !object || Object.keys(object)?.length === 0;
export const arrayIsEmpty = (arr) => !arr || arr.length === 0;

export const getRating = (rates = {}) => {
    let sumatory = 0;
    Object.values(rates).forEach(rate => {
        sumatory += rate;
    })
    const floatRating = sumatory / (Object.values(rates).length || 1);

    const fixedRating = Math.floor(floatRating);
    let finalRating = fixedRating;
    if (floatRating - fixedRating >= 0.5) finalRating += 0.5;

    return finalRating;
}

export const translateChord = (chord, toLang, currentLang) => {
    if (currentLang === toLang) return chord;
    const fromLang = toLang === "en" ? "es" : "en";
    for (let i = 0; i < allChords[fromLang].length; i++) {
        const chordIndex = allChords[fromLang][i].chords.findIndex(bookedChord => bookedChord.toUpperCase() === chord.toUpperCase());
        if (chordIndex >= 0) return allChords[toLang][i].chords[chordIndex];
    }
    return chord;
}

export const getChordIndex = (chord, chordLang = "en") => {
    // In allChords
    for (let i = 0; i < allChords[chordLang].length; i++)
        for (let k = 0; k < allChords[chordLang][i].chords.length; k++)
            if (!allChords[chordLang][i].chords[k].localeCompare(chord)) return [i, k];
};

export const getModuleDiference = (a, b) => {
    const difference = (a - b) * -1;
    if (difference < 0) return 12 + difference;
    return difference;
};

export const transportChord = (lastChord, toneDiference, chordLang) => {
    const lastChordIndex = getChordIndex(lastChord, chordLang);
    let newChordIndex = lastChordIndex[1] + toneDiference;
    if (newChordIndex > 11) newChordIndex = newChordIndex - 12;
    return allChords[chordLang][lastChordIndex[0]].chords[newChordIndex];
};

export const getChordsFromLyric = (lyric, chordLang, alsoFormatLyricWithChords = false) => {
    const songLines = lyric.split("\n");
    const newChords = {};
    let onlyLyric = [...songLines];

    const allChordsArrayEN = allChords["en"].reduce((allChordsEN, chordType) => [...allChordsEN, ...chordType.chords], []).reverse();
    const allChordsArrayES = allChords["es"].reduce((allChordsES, chordType) => [...allChordsES, ...chordType.chords], []).reverse();

    let chordLangFound = null;
    let finalLineIndex = -1;
    songLines.forEach((currentLine) => {
        finalLineIndex++;
        let line = (" " + currentLine + " ").replaceAll('\t', " ").toUpperCase();
        if (line.replaceAll(" ", "") === "") return;

        // Quita los acordes para ver si es una linea solo de acordes, y obtiene el chordLangFound
        for (let i = 0; i < allChordsArrayEN.length && line.replaceAll(" ", "") !== ""; i++) {
            if (chordLangFound === null || chordLangFound === "en") {
                const upperChordEN = allChordsArrayEN[i].toUpperCase();
                while (line.includes(` ${upperChordEN} `)) {
                    line = line.replace(upperChordEN, "");
                    if (!chordLangFound) chordLangFound = "en";
                }
                // Also check bemols
                if (upperChordEN.includes("#")) {
                    const upperChordENbemol = Object.keys(replaceBemols.en).find(bemolChord => replaceBemols.en[bemolChord].slice(0, -1) === upperChordEN.split('#')[0]);
                    while (line.includes(` ${upperChordENbemol} `)) {
                        line = line.replace(upperChordENbemol, "");
                        if (!chordLangFound) chordLangFound = "en";
                    }
                }
            }
            if (chordLangFound === null || chordLangFound === "es") {
                const upperChordES = allChordsArrayES[i].toUpperCase();
                while (line.includes(` ${upperChordES} `)) {
                    line = line.replace(` ${upperChordES} `, " ");
                    if (!chordLangFound) chordLangFound = "es";
                }
                // Also check bemols
                if (upperChordES.includes("#")) {
                    const upperChordESbemol = Object.keys(replaceBemols.es).find(bemolChord => replaceBemols.es[bemolChord].slice(0, -1) === upperChordES.split('#')[0]);
                    while (line.includes(` ${upperChordESbemol} `)) {
                        line = line.replace(upperChordESbemol, "");
                        if (!chordLangFound) chordLangFound = "es";
                    }
                }
            }

        }

        // Si es linea de acordes, la revisa y los agrega a newChords
        // console.log("ACA", { line });
        if (line.replaceAll(" ", "") === "") {
            const chordLine = currentLine + " ";
            let newChord = "";
            let newChordIndex = null;
            chordLine.split("").forEach((character, index) => {
                if (character !== " " && !!newChord) {
                    newChord += character;
                } else if (character !== " " && !newChord) {
                    newChordIndex = index;
                    newChord += character;
                } else if (character === " " && !!newChord) {
                    // Replace bemol
                    for (const bemolChord of Object.keys(replaceBemols[chordLangFound])) {
                        if (newChord.toUpperCase().includes(bemolChord)) {
                            newChord = newChord.toUpperCase().replace(bemolChord, replaceBemols[chordLangFound][bemolChord])
                            break;
                        }
                    }
                    newChords[finalLineIndex] = {
                        ...(newChords[finalLineIndex] || {}),
                        [newChordIndex]: { chord: translateChord(newChord, chordLang, chordLangFound) }
                    };
                    // if (newChords[finalLineIndex]) {
                    //     newChords[finalLineIndex][newChordIndex] = translateChord(newChord, "en", chordLangFound);
                    // } else {
                    //     newChords[finalLineIndex] = { 
                    //         ...newChords[finalLineIndex],
                    //         [newChordIndex]: translateChord(newChord, "en", chordLangFound) 
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
            if (onlyLyric[finalLineIndex].includes("[chord ")) {
                const bracketsRegex = /\[[^[]]*\]/g;
                while (onlyLyric[finalLineIndex].includes("[chord ") && bracketsRegex.test(onlyLyric[finalLineIndex])) {
                    const newChordIndex = onlyLyric.indexOf("[chord ")
                    const content = line.split("[CHORD ")[1].split("]")[0];
                    let [newChord, newChordDuration] = content.split("|");

                    for (const bemolChord of Object.keys(replaceBemols[chordLangFound])) {
                        if (newChord.toUpperCase().includes(bemolChord)) {
                            newChord = newChord.toUpperCase().replace(bemolChord, replaceBemols[chordLangFound][bemolChord])
                            break;
                        }
                    }
                    newChords[finalLineIndex] = {
                        ...(newChords[finalLineIndex] || {}),
                        [newChordIndex]: { chord: translateChord(newChord, chordLang, chordLangFound), duration: newChordDuration }
                    };

                    onlyLyric[finalLineIndex].replace(bracketsRegex, '')
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
            const lineToSearchChord = Object.values(newChords)[lineToSearchChordNumber];
            firstChord = Object.values(lineToSearchChord)[0]?.chord;
            lineToSearchChordNumber++;
        } while (!firstChord && lineToSearchChordNumber < Object.values(newChords).length)

        if (!!firstChord) {
            // chordTone = translateChord(firstChord, "en", chordLangFound);
            const chordIndex = getChordIndex(firstChord, chordLang);
            chordTone = allChords?.[chordLang]?.[0]?.chords?.[chordIndex[1]];
        }

        // Adjust if chordLine is larger
        for (const lineIndex in newChords) {
            if (!onlyLyric[lineIndex]) onlyLyric[lineIndex] = " ";
            for (const charIndex in newChords[lineIndex]) {
                const lineLength = onlyLyric[lineIndex].length;
                if (lineLength < charIndex) {
                    for (let j = 0; j <= Number(charIndex) - lineLength; j++) {
                        onlyLyric[lineIndex] += " ";
                    }
                }
            }
        }
    }

    const newLyricFormatted = onlyLyric.slice().map(line => line.split(""));
    if (alsoFormatLyricWithChords) {
        for (const lineIndex in newChords) {
            for (const charIndex of Object.keys(newChords[lineIndex]).reverse()) {
                const chordDuration = newChords[lineIndex][charIndex]?.duration ? ("|" + newChords[lineIndex][charIndex]?.duration) : "";
                const chordString = `[chord ${newChords[lineIndex][charIndex].chord}${chordDuration}]`;

                newLyricFormatted[lineIndex].splice(charIndex, 0, chordString);
            }
        }
    }
    return { chords: newChords, chordTone, onlyLyric: onlyLyric.join("\n"), newLyricFormatted: newLyricFormatted.map(line => line.join("")).join("\n") };
}

export const getLyricWithChords = (onlyLyric, chords) => {
    let lyric = onlyLyric.split("\n");

    let numInsertedLines = 0;
    if (chords) {
        Object.keys(chords).forEach((lineIndex) => {
            const lyricLineIndex = Number(lineIndex) + numInsertedLines;
            lyric.splice(lyricLineIndex, 0, "");

            Object.keys(chords[lineIndex]).forEach(charIndex => {
                const numberOfSpaces = Number(charIndex) - lyric[lyricLineIndex].length;
                for (let i = 0; i < numberOfSpaces; i++) lyric[lyricLineIndex] += " ";
                lyric[lyricLineIndex] += chords[lineIndex][charIndex]
            })

            numInsertedLines++;
        })
    }

    return lyric.join("\n");
}

export const objsAreEqual = (obj1, obj2) => {
    // Only they first children
    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    for (const key in obj2) {
        if (obj2[key] !== obj1[key]) return false;
    }

    return true;
}
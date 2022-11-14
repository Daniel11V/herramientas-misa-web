import allChords from "./data/allChords.js";
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

export const getChordsFromLyric = (lyric) => {
    const songLines = lyric.split("\n");
    const newChords = {};
    let onlyLyric = [...songLines];

    let reallyAllChordsEN = [];
    allChords["en"].forEach((chordType) => {
        reallyAllChordsEN = reallyAllChordsEN.concat(chordType.chords);
    });
    let reallyAllChordsES = [];
    allChords["es"].forEach((chordType) => {
        reallyAllChordsES = reallyAllChordsES.concat(chordType.chords);
    });

    let finalLineIndex = -1;
    songLines.forEach((currentLine) => {
        finalLineIndex++;
        if (currentLine.replaceAll(" ", "") === "") return;
        let line = " " + currentLine + " ";

        reallyAllChordsEN.forEach((chord) => {
            while (line.includes(` ${chord} `)) line = line.replace(chord, "");
        });
        reallyAllChordsES.forEach((chord) => {
            while (line.includes(` ${chord} `)) line = line.replace(chord, "");
        });
        // reallyAllChordsEN.forEach((chord) => {
        // 	while (line.toUpperCase().includes(` ${chord.toUpperCase()} `))
        // 		line = line.replace(chord, "").replace(chord.toUpperCase(), "");
        // });
        // reallyAllChordsES.forEach((chord) => {
        // 	while (line.toUpperCase().includes(` ${chord.toUpperCase()} `))
        // 		line = line.replace(chord, "").replace(chord.toUpperCase(), "");
        // });
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
                    if (newChords[finalLineIndex]) {
                        newChords[finalLineIndex][newChordIndex] = newChord;
                    } else {
                        newChords[finalLineIndex] = { [newChordIndex]: newChord };
                    }
                    newChord = "";
                    newChordIndex = null;
                }
            });
            onlyLyric.splice(finalLineIndex, 1);
            finalLineIndex--;
        }
    });

    // If has chords, set tone
    let chordTone = "";
    let chordLang = "";
    if (newChords && Object.keys(newChords).length !== 0) {
        const i = Object.keys(newChords)[0];
        const k = Object.keys(newChords[i])[0];

        chordTone = newChords[i][k];
        chordLang = reallyAllChordsEN.includes(newChords[i][k]) ? "en" : "es"

        // Adjust if chordLine is larger
        for (const lineIndex in newChords) {
            if (!onlyLyric[lineIndex]) onlyLyric[lineIndex] = " ";
            for (const charIndex in newChords[lineIndex]) {
                const lineLength = onlyLyric[lineIndex].length;
                if (lineLength < charIndex) {
                    for (let j = 0; j <= charIndex - lineLength; j++) {
                        onlyLyric[lineIndex] += " ";
                    }
                }
            }
        }
    }

    return { chords: newChords, chordTone, chordLang, onlyLyric: onlyLyric.join("\n") };
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
import allChords from "../data/allChords";
import searchLabels from "../data/searchLabels";

export const errorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

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
};

export const objIsEmpty = (object) =>
	!object || Object.keys(object)?.length === 0;
export const arrayIsEmpty = (arr) => !arr || arr.length === 0;

export const getRating = (rates = {}) => {
	let sumatory = 0;
	Object.values(rates).forEach((rate) => {
		sumatory += rate;
	});
	const floatRating = sumatory / (Object.values(rates).length || 1);

	const fixedRating = Math.floor(floatRating);
	let finalRating = fixedRating;
	if (floatRating - fixedRating >= 0.5) finalRating += 0.5;

	return finalRating;
};

export const objsAreEqual = (obj1, obj2) => {
	// Only they first children
	for (const key in obj1) {
		if (obj1[key] !== obj2[key]) return false;
	}

	for (const key in obj2) {
		if (obj2[key] !== obj1[key]) return false;
	}

	return true;
};

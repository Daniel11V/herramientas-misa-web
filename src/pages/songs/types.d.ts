import { chordToEN, chordToES } from "../../data/allChords";

export const CHORD_LANGS: Record<'EN'|'ES', "en" | "es"> = {
	EN: "en",
	ES: "es",
} as const;
export type TChordLang = (typeof CHORD_LANGS)[keyof typeof CHORD_LANGS];
export type TChordLang = typeof CHORD_LANGS.EN | typeof CHORD_LANGS.ES

export type TChord = {
	chord: TChordString;
	duration: string;
}

export type TChordInLyric = Record<number|string,Record<number|string,TChord>>

export type TChordStringES = (typeof chordToES)[keyof typeof chordToES];
export type TChordStringEN = (typeof chordToEN)[keyof typeof chordToEN];
export type TChordString = TChordStringES | TChordStringEN

export type TLetterIndex = [number, number]

export const CHORD_LANGS = {
	EN: "en",
	ES: "es",
};
export type TChordLang = (typeof CHORD_LANGS)[keyof typeof CHORD_LANGS];

export interface TChord {
	chord: string;
	duration: string;
}

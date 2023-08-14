import { type Author } from "../author/types";

export interface Creator {
	id: string;
	name: string;
}

export interface Song {
	id: string;
	versionGroupId: string;
	isPrivate: boolean;
	lyricId: string;
	lyricIsPrivate: boolean;
	title: string;
	lyricStart: string;
	author: Author;
	creator: Creator;
	labels: Array<string>;
	topics?: Array<string>;
	rating?: [];
	level: {
		general: number;
		guitar?: number;
		//...
	};
	annotations?: string;
	tone?: string;
	pulse?: string;
	tempo?: string;
	lyric: string;
}

export const generalLevelOptions = {
	general: [
		{ value: "0", label: "0. Nueva: guardada en mi biblioteca" },
		{
			value: "1",
			label: "1. Conocida: la puedo tocar acompañado y viendo la letra",
		},
		{ value: "2", label: "2. Aprendida: la puedo tocar solo" },
		{ value: "3", label: "3. Memorizada: me la se de memoria" },
	],
};
/*
export const songLevels = {
    1: "Aprendiendo Melodía: todovía no me sale cantarla",
    2: "Aprendiendo Letra: la puedo cantar viendo la letra",
    3: "Masterizada: la puedo tocar solo",
    4: "Memorizada: me la se de memoria",
}
*/

export type PublicSongTitle = Omit<Song, "lyric">;
export type PublicSongLyric = Pick<Song, "lyric">;
// songTitleId: { type: "String", required: true },
// id: { type: "String", required: true },

export interface PrivateSongTitle extends PublicSongTitle {
	hasAccess: {
		$userId: "string"; // is name
	};
}

export interface PrivateSongLyric extends PublicSongLyric {}

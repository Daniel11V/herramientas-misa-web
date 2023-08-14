import { type Author } from "../author/types";

export interface ICreator {
	id: string;
	name: string;
}

export interface IRate {
	userId: string;
	userRate: number;
}

export interface ISongDB {
	id: string;
	versionGroupId: string;
	isPrivate: boolean;
	lyricId: string;
	lyricIsPrivate: boolean;
	title: string;
	lyricStart: string;
	author: Author;
	creator: ICreator;
	labels: Array<string>;
	topics?: Array<string>;
	rating?: IRate[];
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

export interface ISongForm {
	title: string;
	author: Author;
	labels: Array<string>;
	topics?: Array<string>;
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

export type IPublicSongTitleDB = Omit<ISongDB, "lyric">;
export type IPublicSongLyricDB = Pick<ISongDB, "lyric">;
// songTitleId: { type: "String", required: true },
// id: { type: "String", required: true },

export interface IPrivateSongTitleDB extends IPublicSongTitleDB {
	hasAccess: {
		$userId: "string"; // is name
	};
}

export interface IPrivateSongLyricDB extends IPublicSongLyricDB {}

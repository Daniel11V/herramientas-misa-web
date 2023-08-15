import { type IAuthor } from "../author/types";
import { IUserDB } from "../user/types";

export interface ICreator {
	id: string;
	name: string;
}

export interface IRate {
	userId: string;
	userRate: number;
}

export interface ISong {
	id: string;
	versionGroupId: string;
	isPrivate: boolean;
	lyricId: string;
	lyricIsPrivate: boolean;
	title: string;
	lyricStart: string;
	author: IAuthor;
	creator: ICreator;
	hasAccess?: Record<IUserDB["id"], IUserDB["name"]>;
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
	author: IAuthor;
	creator: ICreator;
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

export interface IPublicSongTitleDB
	extends Omit<ISong, "lyric" | "hasAccess"> {}
// export type IPublicSongLyricDB = Pick<ISong, "lyric">;

export interface IPublicSongLyricDB {
	lyric: string;
}

export interface IPrivateSongTitleDB extends IPublicSongTitleDB {
	hasAccess: Record<IUserDB["id"], IUserDB["name"]>; // { userId: name, ...}
}

export interface IPrivateSongLyricDB {
	lyric: string;
}

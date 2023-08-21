import { TypeError } from "../../utils/errors";
import { type TAuthor } from "../author/types";
import { TUserDB, TUserId } from "../user/types";

export type TCreator = {
	id: string;
	name: string;
};

export type TRate = {
	userId: string;
	userRate: number;
};

export type TSongId = string;

export type TSong = {
	id: TSongId;
	versionGroupId: string;
	isPrivate: boolean;
	lyricId: string;
	lyricIsPrivate: boolean;
	title: string;
	lyricStart: string;
	author: TAuthor;
	creator: TCreator;
	labels: Array<string>;
	level: {
		general: number;
		guitar?: number;
		[key: string]: number;
	};
	privateAccess?: Record<TUserId, TUserDB["name"]>;
	topics?: Array<string>;
	rating?: TRate[];
	annotations?: string;
	tone?: string;
	pulse?: string;
	tempo?: string;
	lyric?: string;
};

export type TSongList = Record<TSongId, TSong>;

export type TSongForm = {
	title: string;
	author: TAuthor;
	creator: TCreator;
	labels: Array<string>;
	topics?: Array<string>;
	annotations?: string;
	tone?: string;
	pulse?: string;
	tempo?: string;
	lyric: string;
};

export type TSongOptions = {
	tone?: TSong["tone"];
	annotations?: TSong["annotations"];
	level?: TSong["level"];
};

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

export type TPublicSongTitleDB = Omit<TSong, "lyric" | "privateAccess">;
// export type TPublicSongLyricDB = Pick<TSong, "lyric">;
export type TPublicSongTitleListDB = Record<
	TPublicSongTitleDB["id"],
	TPublicSongTitleDB
>;

export type TPublicSongLyricDB = {
	lyric: string;
};
export type TPrivateRepertoryListDB = Record<
	TPrivateRepertoryDB["id"],
	TPrivateRepertoryDB
>;

export type TPrivateSongTitleDB = TPublicSongTitleDB & {
	privateAccess: Record<TUserId, TUserDB["name"]>; // { userId: name, ...}
};
export type TPrivateSongTitleListDB = Record<
	TPrivateSongTitleDB["id"],
	TPrivateSongTitleDB
>;

export type TPrivateSongLyricDB = {
	lyric: string;
};
export type TPrivateRepertoryListDB = Record<
	TPrivateRepertoryDB["id"],
	TPrivateRepertoryDB
>;

import {
	validArray,
	validBool,
	validNumber,
	validRecord,
	validString,
} from "../../utils/generalUtils";
import { TUserDB, TUserId } from "../user/types";
import { TPrivateSongTitleDB, TPublicSongTitleDB, TSong } from "./types";

export const createTSong = ({
	id,
	versionGroupId,
	isPrivate,
	lyricId,
	lyricIsPrivate,
	title,
	lyricStart,
	author,
	creator,
	privateAccess,
	labels,
	topics,
	rating,
	level,
	annotations,
	tone,
	pulse,
	tempo,
	lyric,
}: Partial<TSong>): TSong => {
	const typeName = "TSong";

	const newTSong: TSong = {
		id: validString(id, typeName),
		versionGroupId: validString(versionGroupId, typeName),
		isPrivate: validBool(isPrivate, typeName),
		lyricId: validString(lyricId, typeName),
		lyricIsPrivate: validBool(lyricIsPrivate, typeName),
		title: validString(title, typeName),
		lyricStart: validString(lyricStart, typeName),
		labels: validArray<string>(labels, typeName, validString),
		author: {
			id: validString(author?.id, typeName),
			name: validString(author?.name, typeName),
		},
		creator: {
			id: validString(creator?.id, typeName),
			name: validString(creator?.name, typeName),
		},
		level: {
			general: validNumber(level?.general, typeName),
			...level,
		},
		privateAccess,
		topics,
		rating,
		annotations,
		tone,
		pulse,
		tempo,
		lyric,
	};

	return newTSong;
};

export const createTPrivateSongTitleDB = ({
	id,
	versionGroupId,
	isPrivate,
	lyricId,
	lyricIsPrivate,
	title,
	lyricStart,
	author,
	creator,
	privateAccess,
	labels,
	topics,
	rating,
	level,
	annotations,
	tone,
	pulse,
	tempo,
}: Partial<TPrivateSongTitleDB>): TPrivateSongTitleDB => {
	const typeName = "TPrivateSongTitleDB";

	const newTSong: TPrivateSongTitleDB = {
		id: validString(id, typeName),
		versionGroupId: validString(versionGroupId, typeName),
		isPrivate: validBool(isPrivate, typeName),
		lyricId: validString(lyricId, typeName),
		lyricIsPrivate: validBool(lyricIsPrivate, typeName),
		title: validString(title, typeName),
		lyricStart: validString(lyricStart, typeName),
		labels: validArray<string>(labels, typeName, validString),
		author: {
			id: validString(author?.id, typeName),
			name: validString(author?.name, typeName),
		},
		creator: {
			id: validString(creator?.id, typeName),
			name: validString(creator?.name, typeName),
		},
		level: {
			general: validNumber(level?.general, typeName),
			...level,
		},
		privateAccess: validRecord<TUserId, TUserDB["name"]>(
			privateAccess,
			validString,
			validString,
			typeName
		),
		topics,
		rating,
		annotations,
		tone,
		pulse,
		tempo,
	};

	return newTSong;
};

export const createTPublicSongTitleDB = ({
	id,
	versionGroupId,
	isPrivate,
	lyricId,
	lyricIsPrivate,
	title,
	lyricStart,
	author,
	creator,
	labels,
	topics,
	rating,
	level,
	annotations,
	tone,
	pulse,
	tempo,
}: Partial<TPublicSongTitleDB>): TPublicSongTitleDB => {
	const typeName = "TPublicSongTitleDB";

	const newTSong: TPublicSongTitleDB = {
		id: validString(id, typeName),
		versionGroupId: validString(versionGroupId, typeName),
		isPrivate: validBool(isPrivate, typeName),
		lyricId: validString(lyricId, typeName),
		lyricIsPrivate: validBool(lyricIsPrivate, typeName),
		title: validString(title, typeName),
		lyricStart: validString(lyricStart, typeName),
		labels: validArray<string>(labels, typeName, validString),
		author: {
			id: validString(author?.id, typeName),
			name: validString(author?.name, typeName),
		},
		creator: {
			id: validString(creator?.id, typeName),
			name: validString(creator?.name, typeName),
		},
		level: {
			general: validNumber(level?.general, typeName),
			...level,
		},
		topics,
		rating,
		annotations,
		tone,
		pulse,
		tempo,
	};

	return newTSong;
};

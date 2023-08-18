import { TypeCreationError } from "../../utils/errors";
import { TUserDB, TUserId } from "../user/types";
import { TPrivateSongTitleDB, TSong } from "./types";

const validNumber = (value: unknown, typeName: string): number => {
	if (
		value === undefined ||
		value === null ||
		typeof value !== "number" ||
		isNaN(value)
	) {
		throw new TypeCreationError(typeName);
	}
	return value;
};
const validString = (value: unknown, typeName: string): string => {
	if (value === undefined || value === null || typeof value !== "string") {
		throw new TypeCreationError(typeName);
	}
	return value;
};
const validBool = (value: unknown, typeName: string): boolean => {
	if (value === undefined || value === null || typeof value !== "boolean") {
		throw new TypeCreationError(typeName);
	}
	return !!value;
};
const validRecord = <P extends string, U>(
	value: unknown,
	keyValidation: (item: unknown, typeName: string) => P,
	itemValidation: (item: unknown, typeName: string) => U,
	typeName: string
): Record<P, U> => {
	if (
		value === undefined ||
		value === null ||
		typeof value !== "object" ||
		Array.isArray(value)
	) {
		throw new TypeCreationError(typeName);
	}

	Object.keys(value).forEach((v) => keyValidation(v, typeName));
	Object.values(value).forEach((v) => itemValidation(v, typeName));

	return value as Record<P, U>;
};
const validArray = <P>(
	value: unknown,
	itemValidation: (item: unknown, typeName: string) => P,
	typeName: string
): Array<P> => {
	if (value === undefined || value === null || !Array.isArray(value)) {
		throw new TypeCreationError(typeName);
	}
	value?.forEach((v) => itemValidation(v, typeName));

	return [...(value as Array<P>)];
};

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
		labels: validArray<string>(labels, validString, typeName),
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
		labels: validArray<string>(labels, validString, typeName),
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

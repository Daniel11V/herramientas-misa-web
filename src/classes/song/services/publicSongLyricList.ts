import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";
import { TPublicSongLyricDB, TSongId } from "../types";

export const getPublicSongLyricDB = async (p: {
	songLyricId: TSongId;
}): Promise<TPublicSongLyricDB> => {
	const { songLyricId } = p;
	if (!songLyricId) throw new Error("Invalid song ID.");

	const publicSongLyric =
		store.getState().database.publicSongLyricList[songLyricId];

	return publicSongLyric;
};

export const createPublicSongLyricDB = async (p: { lyric: string }): Promise<TSongId> => {
	const { lyric } = p;
	if (!lyric) throw new Error("Invalid lyric.");
	const newId = new Date().getTime().toString();
	await store.dispatch(
		setDatabaseItem("publicSongLyricList", newId, { lyric })
	);
	const response = { id: newId, lyric };

	if (!response) throw new Error("Error in createPublicSongLyricDB.");

	return newId;
};

export const editPublicSongLyricDB = async (p: {
	lyricId: string;
	lyric: string;
}) => {
	const { lyricId, lyric } = p;
	await store.dispatch(
		setDatabaseItem("publicSongLyricList", lyricId, { lyric })
	);
	return;
};

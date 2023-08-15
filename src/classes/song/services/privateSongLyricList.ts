import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { IPrivateSongLyricDB } from "../types";

// export const getPrivateSongLyricListDB = async (p: {
// 	songLyricId: string;
// 	userId: string;
// }): Promise<Record<string, IPrivateSongLyricDB>> => {
// 	const { songLyricId, userId } = p;

// 	if (!songLyricId) throw new Error("Invalid user ID.");

// 	const allPrivateSongLyricList: Record<string, IPrivateSongLyricDB> =
// 		store.getState().database.privateSongLyricList;

// 	const userPrivateSongLyricList =
// 		Object.values(allPrivateSongLyricList).reduce(
// 			(userPrivateSongLyricList, privateSongLyric) =>
// 				privateSongLyric.creator.id === userId
// 					? {
// 							...userPrivateSongLyricList,
// 							[privateSongLyric.id]: privateSongLyric,
// 					  }
// 					: userPrivateSongLyricList,
// 			{}
// 		) || {};

// 	return userPrivateSongLyricList;
// };

export const getPrivateSongLyricDB = async (p: {
	songLyricId: string;
}): Promise<IPrivateSongLyricDB | null> => {
	const { songLyricId } = p;

	if (!songLyricId) throw new Error("Invalid song lyric ID.");

	const privateSongLyric =
		store.getState().database.privateSongLyricList[songLyricId];

	return privateSongLyric || null;
};

export const createPrivateSongLyricDB = async (p: {
	lyric: string;
}): Promise<string> => {
	const { lyric } = p;

	const newId = new Date().getTime().toString();
	await store.dispatch(
		setDatabaseItem("privateSongLyricList", newId, { lyric })
	);

	if (!newId) throw new Error("Error fetching in createPrivateSongLyricDB.");

	return newId;
};

export const editPrivateSongLyricDB = async (p: {
	lyricId: string;
	lyric: string;
}): Promise<void | null> => {
	const { lyricId, lyric } = p;
	await store.dispatch(
		setDatabaseItem("privateSongLyricList", lyricId, { lyric })
	);
	return;
};

export const deletePrivateSongLyricDB = async (p: {
	songLyricId: string;
}): Promise<string | null> => {
	const { songLyricId } = p;
	await store.dispatch(deleteDatabaseItem("privateSongLyricList", songLyricId));
	return songLyricId || null;
};

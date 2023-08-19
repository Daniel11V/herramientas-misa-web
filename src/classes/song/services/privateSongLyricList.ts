import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { TPrivateSongLyricDB, TSongId } from "../types";

// export const getPrivateSongLyricListDB = async (p: {
// 	songLyricId: string;
// 	userId: string;
// }): Promise<Record<string, TPrivateSongLyricDB>> => {
// 	const { songLyricId, userId } = p;

// 	if (!songLyricId) throw new Error("Invalid user ID.");

// 	const allPrivateSongLyricList: Record<string, TPrivateSongLyricDB> =
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
}): Promise<TPrivateSongLyricDB> => {
	const { songLyricId } = p;

	if (!songLyricId) throw new Error("Invalid song lyric ID.");

	const privateSongLyric =
		store.getState().database.privateSongLyricList[songLyricId];

	return privateSongLyric;
};

export const createPrivateSongLyricDB = async (p: {
	lyric: string;
}): Promise<TSongId> => {
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
}): Promise<void> => {
	const { lyricId, lyric } = p;
	await store.dispatch(
		setDatabaseItem("privateSongLyricList", lyricId, { lyric })
	);
	return;
};

export const deletePrivateSongLyricDB = async (p: {
	songLyricId: string;
}): Promise<TSongId> => {
	const { songLyricId } = p;
	await store.dispatch(deleteDatabaseItem("privateSongLyricList", songLyricId));
	return songLyricId;
};

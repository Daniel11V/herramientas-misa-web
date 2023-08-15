import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import { IPrivateSongTitleDB, IPublicSongTitleDB } from "../types";

export const getPrivateSongTitleListDB = async (p: {
	userId: string;
}): Promise<Record<IPrivateSongTitleDB["id"], IPrivateSongTitleDB> | null> => {
	const { userId } = p;

	if (!userId) return null;

	const allPrivateSongTitleList: Record<
		IPrivateSongTitleDB["id"],
		IPrivateSongTitleDB
	> = store.getState().database.privateSongTitleList;

	const userPrivateSongTitleList =
		Object.values(allPrivateSongTitleList).reduce(
			(userPrivateSongTitleList, privateSongTitle) =>
				privateSongTitle?.creator?.id === userId
					? {
							...userPrivateSongTitleList,
							[privateSongTitle.id]: privateSongTitle,
					  }
					: userPrivateSongTitleList,
			{}
		) || null;

	return userPrivateSongTitleList;
};

export const getPrivateSongTitleDB = async (p: {
	userId: string;
	songTitleId: string;
	hasInvitation?: boolean;
}): Promise<IPrivateSongTitleDB | null> => {
	const { userId, songTitleId, hasInvitation = false } = p;

	if (!userId && !hasInvitation) return null;
	if (!songTitleId) throw new Error("Invalid song title ID.");

	const privateSongTitle =
		store.getState().database.privateSongTitleList[songTitleId];

	if (!!privateSongTitle && !hasInvitation) {
		const isAuthorized =
			privateSongTitle.creator.id === userId ||
			!!privateSongTitle.hasAccess?.[userId];
		if (!isAuthorized)
			throw new Error("Unauthorized in getPrivateSongTitleDB.");
	}

	return privateSongTitle;
};

export const createPrivateSongTitleDB = async (p: {
	songTitleCreated: IPublicSongTitleDB;
}): Promise<void> => {
	const { songTitleCreated } = p;

	await store.dispatch(
		setDatabaseItem(
			"privateSongTitleList",
			songTitleCreated.id,
			songTitleCreated
		)
	);
};

export const editPrivateSongTitleDB = async ({ songTitleEdited }) => {
	await store.dispatch(
		setDatabaseItem("privateSongTitleList", songTitleEdited.id, songTitleEdited)
	);
	return;
};

export const deletePrivateSongTitleDB = async ({ songTitleId }) => {
	await store.dispatch(deleteDatabaseItem("privateSongTitleList", songTitleId));
	return songTitleId;
};

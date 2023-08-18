import store from "../../../store";
import { deleteDatabaseItem, setDatabaseItem } from "../../database/reducers";
import {
	TPrivateSongTitleDB,
	TPublicSongTitleDB,
	TSong,
	TSongForm,
	TSongId,
} from "../types";

export const getPrivateSongTitleListDB = async (p: {
	userId: string;
}): Promise<Record<TPrivateSongTitleDB["id"], TPrivateSongTitleDB> | null> => {
	const { userId } = p;

	if (!userId) return null;

	const allPrivateSongTitleList: Record<
		TPrivateSongTitleDB["id"],
		TPrivateSongTitleDB
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
}): Promise<TPrivateSongTitleDB | null> => {
	const { userId, songTitleId, hasInvitation = false } = p;

	if (!userId && !hasInvitation) return null;
	if (!songTitleId) throw new Error("Invalid song title ID.");

	const privateSongTitle =
		store.getState().database.privateSongTitleList[songTitleId];

	if (!!privateSongTitle && !hasInvitation) {
		const isAuthorized =
			privateSongTitle.creator.id === userId ||
			!!privateSongTitle.privateAccess?.[userId];
		if (!isAuthorized)
			throw new Error("Unauthorized in getPrivateSongTitleDB.");
	}

	return privateSongTitle;
};

export const createPrivateSongTitleDB = async (p: {
	songTitleCreated: TPublicSongTitleDB;
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

export const editPrivateSongTitleDB = async (p: {
	songTitleEdited: TPrivateSongTitleDB;
}) => {
	const { songTitleEdited } = p;
	await store.dispatch(
		setDatabaseItem("privateSongTitleList", songTitleEdited.id, songTitleEdited)
	);
	return;
};

export const deletePrivateSongTitleDB = async (p: { songTitleId: TSongId }) => {
	const { songTitleId } = p;
	await store.dispatch(deleteDatabaseItem("privateSongTitleList", songTitleId));
	return;
};

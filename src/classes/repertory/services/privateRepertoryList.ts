import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";
import { TUserId } from "../../user/types";
import {
	TPrivateRepertoryDB,
	TPrivateRepertoryListDB,
	TRepertoryId,
} from "../types";

export const getPrivateRepertoryListDB = async (p: {
	userId: TUserId;
}): Promise<TPrivateRepertoryListDB | null> => {
	const { userId } = p;
	if (!userId) return null;

	const allPrivateRepertoryList =
		store.getState().database.privateRepertoryList;

	const userPrivateRepertoryList =
		Object.values(allPrivateRepertoryList).reduce(
			(userPrivateRepertoryList, privateRepertory) =>
				privateRepertory.creator.id === userId
					? {
							...userPrivateRepertoryList,
							[privateRepertory.id]: privateRepertory,
					  }
					: userPrivateRepertoryList,
			{}
		) || {};

	return userPrivateRepertoryList;
};

export const getPrivateRepertoryDB = async (p: {
	userId: TUserId;
	repertoryId: TRepertoryId;
	hasInvitation?: boolean;
}): Promise<TPrivateRepertoryDB | null> => {
	const { userId, repertoryId, hasInvitation = false } = p;
	if (!userId && !hasInvitation) return null;
	if (!repertoryId) throw new Error("Invalid repertory ID.");

	const privateRepertory =
		store.getState().database.privateRepertoryList[repertoryId];

	if (!!privateRepertory && !hasInvitation) {
		const isAuthorized =
			privateRepertory.creator.id === userId ||
			!!privateRepertory.members?.[userId];
		if (!isAuthorized)
			throw new Error("Unauthorized in getPrivateRepertoryDB.");
	}

	return privateRepertory;
};

export const createPrivateRepertoryDB = async (p: {
	repertoryCreated: TPrivateRepertoryDB;
}) => {
	const { repertoryCreated } = p;
	if (!repertoryCreated) throw new Error("Invalid repertory ID.");

	await store.dispatch(
		setDatabaseItem(
			"privateRepertoryList",
			repertoryCreated.id,
			repertoryCreated
		)
	);
};

// export const editPrivateRepertoryDB = async ({ repertoryEdited }) => {};

// export const deletePrivateRepertoryDB = async ({ repertoryDeletedId }) => {};

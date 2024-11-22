import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";
import { TPublicRepertoryDB, TRepertoryId } from "../types.d";

export const getPublicRepertoryListDB = async () => {
	const repertoryList = store.getState().database.publicRepertoryList;

	if (!repertoryList) throw new Error("Error fetching.");

	return repertoryList;
};

export const getPublicRepertoryDB = async (p: {
	repertoryId: TRepertoryId;
}): Promise<TPublicRepertoryDB | null> => {
	const { repertoryId } = p;
	if (!repertoryId) throw new Error("Invalid repertory ID.");

	const repertory = store.getState().database.publicRepertoryList[repertoryId];

	if (!repertory) throw new Error("PublicRepertory not found.");

	return repertory || null;
};

export const createPublicRepertoryDB = async (p: {
	repertoryCreated: TPublicRepertoryDB;
}) => {
	const { repertoryCreated } = p;

	if (!repertoryCreated) throw new Error("Invalid repertory ID.");

	await store.dispatch(
		setDatabaseItem({
			category: "publicRepertoryList",
			id: repertoryCreated.id,
			item: repertoryCreated
		})
	);
};

// export const editPublicRepertoryDB = async ({ repertoryEdited }) => {};

// export const deletePublicRepertoryDB = async ({ repertoryDeletedId }) => {};

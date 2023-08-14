import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";

export const getPublicRepertoryListDB = async () => {
	const repertoryList = store.getState().database.publicRepertoryList;

	if (!repertoryList) throw new Error("Error fetching.");

	return repertoryList;
};

export const getPublicRepertoryDB = async ({ repertoryId }) => {
	if (!repertoryId) throw new Error("Invalid repertory ID.");

	const repertory = store.getState().database.publicRepertoryList[repertoryId];

	if (!repertory) throw new Error("PublicRepertory not found.");

	return repertory;
};

export const createPublicRepertoryDB = async ({ repertoryCreated }) => {
	if (!repertoryCreated) throw new Error("Invalid repertory ID.");

	await store.dispatch(
		setDatabaseItem(
			"publicRepertoryList",
			repertoryCreated.id,
			repertoryCreated
		)
	);
};

export const editPublicRepertoryDB = async ({ repertoryEdited }) => {};

export const deletePublicRepertoryDB = async ({ repertoryDeletedId }) => {};

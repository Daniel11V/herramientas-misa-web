import store from "../../../store";
import { setDatabaseItem } from "../../database/actions";
import { TAuthorDB, TAuthorId } from "../types";

export const getAuthorListDB = async (): Promise<
	Record<TAuthorId, TAuthorDB>
> => {
	const authorList = store.getState().database.authorList;

	if (!authorList) throw new Error("Error fetching.");

	return authorList;
};

export const getAuthorDB = async (p: {
	authorId: string;
}): Promise<TAuthorDB> => {
	const { authorId } = p;

	if (!authorId) throw new Error("Invalid author ID.");

	const author = store.getState().database.authorList[authorId];

	if (!author) throw new Error("Author not found.");

	return author;
};

export const createAuthorDB = async (p: {
	authorCreated: TAuthorDB;
}): Promise<void> => {
	const { authorCreated } = p;

	if (!authorCreated?.id) throw new Error("Invalid author ID.");

	await store.dispatch(
		setDatabaseItem("authorList", authorCreated.id, authorCreated)
	);
};

export const editAuthorDB = async (p: {
	authorEdited: TAuthorDB;
}): Promise<void> => {
	const { authorEdited } = p;
};

export const deleteAuthorDB = async (p: {
	authorDeletedId: string;
}): Promise<void> => {
	const { authorDeletedId } = p;
};

import {
	TDatabaseAction,
	TDatabaseCategory,
	TDatabaseItem,
	TDatabaseState,
	types,
} from "./reducers";

export const setDatabase = (newDatabase: TDatabaseState) => ({
	type: types.SET_DATABASE,
	payload: { newDatabase },
});

export const setDatabaseItem = (
	category: TDatabaseCategory,
	id: string,
	item: TDatabaseItem
): TDatabaseAction => ({
	type: types.SET_DATABASE_ITEM,
	payload: { category, id, item },
});

export const deleteDatabaseItem = (
	category: TDatabaseCategory,
	id: string
): TDatabaseAction => ({
	type: types.DELETE_DATABASE_ITEM,
	payload: { category, id },
});

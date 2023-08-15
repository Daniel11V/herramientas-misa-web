// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { errorMessage, arrayIsEmpty } from "../../utils/generalUtils.ts";
import { IActionType, IDispatchType, fetchStatus } from "../../utils/types";

import {
	getItemListDB,
	getItemDB,
	createItemDB,
	editItemDB,
	deleteItemDB,
} from "./services/itemList.js";
import { IItem } from "./types";
import { IStoreState } from "../../store.ts";

export const types = {
	RESET_ITEM_STATUS: "RESET_ITEM_STATUS",

	SET_ITEM_LIST: "SET_ITEM_LIST",
	SET_ITEM_LIST_STATUS: "SET_ITEM_LIST_STATUS",

	SET_ITEM: "SET_ITEM",
	SET_ITEM_STATUS: "SET_ITEM_STATUS",

	CREATE_ITEM: "CREATE_ITEM",
	CREATE_ITEM_STATUS: "CREATE_ITEM_STATUS",

	EDIT_ITEM: "EDIT_ITEM",
	EDIT_ITEM_STATUS: "EDIT_ITEM_STATUS",

	DELETE_ITEM: "DELETE_ITEM",
	DELETE_ITEM_STATUS: "DELETE_ITEM_STATUS",
};

export const resetItemStatus = (): IActionType => ({
	type: types.RESET_ITEM_STATUS,
});

// Thunks

export const getItemList = (p: { userId: string }) => {
	const { userId } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.SET_ITEM_LIST_STATUS,
				payload: { itemStatus: fetchStatus.FETCHING, error: null },
			});

			const itemList = await getItemListDB({ userId });

			dispatch({
				type: types.SET_ITEM_LIST,
				payload: { itemList, itemStatus: fetchStatus.SUCCESS },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.SET_ITEM_LIST_STATUS,
				payload: {
					itemStatus: fetchStatus.FAILURE,
					error: errorMessage(error),
				},
			});
		}
	};
};

export const getItem = (p: { userId: string; itemId: string }) => {
	const { userId, itemId } = p;
	return async (dispatch: IDispatchType, getState: () => IStoreState) => {
		try {
			dispatch({
				type: types.SET_ITEM_STATUS,
				payload: { itemStatus: fetchStatus.FETCHING, error: null },
			});

			///////////////////////////////

			const { itemList } = getState().item;
			let item;

			if (!arrayIsEmpty(itemList)) {
				item = itemList.find((i) => i.id === itemId);
			} else {
				item = await getItemDB({ userId, itemId });
			}

			///////////////////////////////

			dispatch({
				type: types.SET_ITEM,
				payload: { item, itemStatus: fetchStatus.SUCCESS },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.SET_ITEM_STATUS,
				payload: {
					itemStatus: fetchStatus.FAILURE,
					error: errorMessage(error),
				},
			});
		}
	};
};

export const createItem = (p: {
	itemCreated: IItem;
	saveAsPublic?: boolean;
}) => {
	const { itemCreated, saveAsPublic = true } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.CREATE_ITEM_STATUS,
				payload: { itemStatus: fetchStatus.FETCHING, error: null },
			});

			await createItemDB({ itemCreated });

			dispatch({
				type: types.CREATE_ITEM,
				payload: { itemCreated, itemStatus: fetchStatus.SUCCESS },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.CREATE_ITEM_STATUS,
				payload: {
					itemStatus: fetchStatus.FAILURE,
					error: errorMessage(error),
				},
			});
		}
	};
};

export const editItem = (p: { itemEdited: IItem }) => {
	const { itemEdited } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.EDIT_ITEM_STATUS,
				payload: { itemStatus: fetchStatus.FETCHING, error: null },
			});

			await editItemDB({ itemEdited });

			dispatch({
				type: types.EDIT_ITEM,
				payload: { itemEdited, itemStatus: fetchStatus.SUCCESS },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.EDIT_ITEM_STATUS,
				payload: {
					itemStatus: fetchStatus.FAILURE,
					error: errorMessage(error),
				},
			});
		}
	};
};

export const deleteItem = (p: { itemDeletedId: string }) => {
	const { itemDeletedId } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.DELETE_ITEM_STATUS,
				payload: { itemStatus: fetchStatus.FETCHING, error: null },
			});

			deleteItemDB({ itemDeletedId });

			dispatch({
				type: types.DELETE_ITEM,
				payload: { itemDeletedId, itemStatus: fetchStatus.SUCCESS },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.DELETE_ITEM_STATUS,
				payload: {
					itemStatus: fetchStatus.FAILURE,
					error: errorMessage(error),
				},
			});
		}
	};
};

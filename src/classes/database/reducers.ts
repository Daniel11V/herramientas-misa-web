import { produce } from "immer";
import { testData } from "../../data/testData";
import { IAuthorDB } from "../author/types";
import {
	IPrivateSongLyricDB,
	IPrivateSongTitleDB,
	IPublicSongLyricDB,
	IPublicSongTitleDB,
} from "../song/types";
import { IActionType } from "../../utils/types";
import { IPrivateRepertoryDB, IPublicRepertoryDB } from "../repertory/types";
import { IUserDB } from "../user/types";

export const types = {
	SET_DATABASE: "SET_DATABASE",
	SET_DATABASE_ITEM: "SET_DATABASE_ITEM",
	DELETE_DATABASE_ITEM: "DELETE_DATABASE_ITEM",
};

export interface IDatabaseState {
	authorList: Record<IAuthorDB["id"], IAuthorDB>;
	userList: Record<IUserDB["id"], IUserDB>;
	privateRepertoryList: Record<IPrivateRepertoryDB["id"], IPrivateRepertoryDB>;
	privateSongTitleList: Record<IPrivateSongTitleDB["id"], IPrivateSongTitleDB>;
	privateSongLyricList: Record<string, IPrivateSongLyricDB>;
	publicRepertoryList: Record<IPublicRepertoryDB["id"], IPublicRepertoryDB>;
	publicSongTitleList: Record<IPublicSongTitleDB["id"], IPublicSongTitleDB>;
	publicSongLyricList: Record<string, IPublicSongLyricDB>;
}

export type IDatabaseCategory = keyof IDatabaseState;

export type IDatabaseItem =
	| IAuthorDB
	| IUserDB
	| IPrivateRepertoryDB
	| IPrivateSongTitleDB
	| IPrivateSongLyricDB
	| IPublicRepertoryDB
	| IPublicSongTitleDB
	| IPublicSongTitleDB
	| IPublicSongLyricDB;

export const setDatabase = (newDatabase: IDatabaseState) => ({
	type: types.SET_DATABASE,
	payload: { newDatabase },
});

export const setDatabaseItem = (
	category: IDatabaseCategory,
	id: string,
	item: IDatabaseItem
): IActionType => ({
	type: types.SET_DATABASE_ITEM,
	payload: { category, id, item },
});

export const deleteDatabaseItem = (
	category: IDatabaseCategory,
	id: string
): IActionType => ({
	type: types.DELETE_DATABASE_ITEM,
	payload: { category, id },
});

const initialState: IDatabaseState = { ...testData };

const DatabaseReducer = (
	state: IDatabaseState = initialState,
	{
		type,
		payload,
	}: {
		type: string;
		payload: {
			newDatabase?: IDatabaseState;
			category?: IDatabaseCategory;
			id?: string;
			item?: IDatabaseItem;
		};
	}
) => {
	return produce(state, (newState: IDatabaseState) => {
		switch (type) {
			case types.SET_DATABASE:
				if (payload.newDatabase) newState = payload.newDatabase;
				break;
			case types.SET_DATABASE_ITEM:
				if (payload.category && payload.id && payload.item) {
					newState[payload.category][payload.id] = payload.item;
				}
				break;
			case types.DELETE_DATABASE_ITEM:
				if (payload.category && payload.id) {
					delete newState[payload.category][payload.id];
				}
				break;

			default:
				break;
		}
	});
};

export default DatabaseReducer;

import { produce } from "immer";
import { testData } from "../../data/testData";
import { TAuthorDB, TAuthorListDB } from "../author/types";
import {
	TPrivateSongLyricDB,
	TPrivateSongTitleDB,
	TPrivateSongTitleListDB,
	TPublicSongLyricDB,
	TPublicSongTitleDB,
} from "../song/types";
import { TAction } from "../../utils/types";
import {
	TPrivateRepertoryDB,
	TPrivateRepertoryListDB,
	TPublicRepertoryDB,
	TPublicRepertoryListDB,
} from "../repertory/types";
import { TUserDB, TUserListDB } from "../user/types";

export const types = {
	SET_DATABASE: "SET_DATABASE",
	SET_DATABASE_ITEM: "SET_DATABASE_ITEM",
	DELETE_DATABASE_ITEM: "DELETE_DATABASE_ITEM",
};

export type TDatabaseState = {
	authorList: TAuthorListDB;
	userList: TUserListDB;
	privateRepertoryList: TPrivateRepertoryListDB;
	privateSongTitleList: TPrivateSongTitleListDB;
	privateSongLyricList: Record<string, TPrivateSongLyricDB>;
	publicRepertoryList: TPublicRepertoryListDB;
	publicSongTitleList: Record<TPublicSongTitleDB["id"], TPublicSongTitleDB>;
	publicSongLyricList: Record<string, TPublicSongLyricDB>;
};

export type TDatabaseCategory = keyof TDatabaseState;

export type TDatabaseItem =
	| TAuthorDB
	| TUserDB
	| TPrivateRepertoryDB
	| TPrivateSongTitleDB
	| TPrivateSongLyricDB
	| TPublicRepertoryDB
	| TPublicSongTitleDB
	| TPublicSongTitleDB
	| TPublicSongLyricDB;

export const setDatabase = (newDatabase: TDatabaseState) => ({
	type: types.SET_DATABASE,
	payload: { newDatabase },
});

export const setDatabaseItem = (
	category: TDatabaseCategory,
	id: string,
	item: TDatabaseItem
): TAction => ({
	type: types.SET_DATABASE_ITEM,
	payload: { category, id, item },
});

export const deleteDatabaseItem = (
	category: TDatabaseCategory,
	id: string
): TAction => ({
	type: types.DELETE_DATABASE_ITEM,
	payload: { category, id },
});

const initialState: TDatabaseState = { ...testData };

const DatabaseReducer = (
	state: TDatabaseState = initialState,
	{
		type,
		payload,
	}: {
		type: string;
		payload: {
			newDatabase?: TDatabaseState;
			category?: TDatabaseCategory;
			id?: string;
			item?: TDatabaseItem;
		};
	}
) => {
	return produce(state, (newState: TDatabaseState) => {
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

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
import {
	TPrivateRepertoryDB,
	TPrivateRepertoryListDB,
	TPublicRepertoryDB,
	TPublicRepertoryListDB,
} from "../repertory/types";
import { TUserDB, TUserListDB } from "../user/types";
import { valid } from "../../utils/generalUtils";

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

const initialState: TDatabaseState = { ...testData };

export type TDatabaseAction = {
	type: string;
	payload?: Partial<TDatabaseState> & {
		newDatabase?: TDatabaseState;
		category?: TDatabaseCategory;
		id?: string;
		item?: TDatabaseItem;
	};
};

const DatabaseReducer = (
	state = initialState,
	{ type, payload }: TDatabaseAction
) => {
	return produce(state, (newState: TDatabaseState) => {
		if (type === types.SET_DATABASE) {
			newState = valid(payload?.newDatabase, type);
		}
		if (type === types.SET_DATABASE_ITEM) {
			let category = valid(payload?.category, type);
			let id = valid(payload?.id, type);
			let item = valid(payload?.item, type);
			newState[category][id] = item;
		}
		if (type === types.DELETE_DATABASE_ITEM) {
			let category = valid(payload?.category, type);
			let id = valid(payload?.id, type);
			delete newState[category][id];
		}
	});
};

export default DatabaseReducer;

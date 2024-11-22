import { testData } from "../../data/testData";
import { TAuthorDB, TAuthorListDB } from "../author/types.d";
import {
	TPrivateSongLyricDB,
	TPrivateSongTitleDB,
	TPrivateSongTitleListDB,
	TPublicSongLyricDB,
	TPublicSongTitleDB,
} from "../song/types.d";
import {
	TPrivateRepertoryDB,
	TPrivateRepertoryListDB,
	TPublicRepertoryDB,
	TPublicRepertoryListDB,
} from "../repertory/types.d";
import { TUserDB, TUserListDB } from "../user/types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    setDatabase: (state, action: PayloadAction<{newDatabase: TDatabaseState}>) => {
		state = valid(action.payload?.newDatabase, 'setDatabase');
    },
    setDatabaseItem: (state, action: PayloadAction<{category: TDatabaseCategory, id: string, item: TDatabaseItem}>) => {
		let category = valid(action.payload?.category, 'setDatabaseItem');
		let id = valid(action.payload?.id, 'setDatabaseItem');
		let item = valid(action.payload?.item, 'setDatabaseItem');
		state[category][id] = item;    
	},
    deleteDatabaseItem: (state, action: PayloadAction<{category: TDatabaseCategory, id: string}>) => {
		let category = valid(action.payload?.category, 'deleteDatabaseItem');
		let id = valid(action.payload?.id, 'deleteDatabaseItem');
		delete state[category][id];
	},
  },
});

export const { 
	setDatabase,
	setDatabaseItem,
	deleteDatabaseItem,
} = databaseSlice.actions;
export default databaseSlice.reducer;

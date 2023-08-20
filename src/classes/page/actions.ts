// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'

import { TAction } from "../../utils/types";
import { TSong } from "../song/types";
import { TPageState } from "./reducers";

// import { database } from "../../data/database.js";
export const types = {
	SET_SONG_PAGE_BACKUP: "SET_SONG_PAGE_BACKUP",
	SET_SONG_PAGE_BACKUP_SONG: "SET_SONG_PAGE_BACKUP_SONG",
	SET_SONG_LIST_PAGE_BACKUP: "SET_SONG_LIST_PAGE_BACKUP",
	SET_REPERTORY_PAGE_BACKUP: "SET_REPERTORY_PAGE_BACKUP",
	SET_REPERTORY_LIST_PAGE_BACKUP: "SET_REPERTORY_LIST_PAGE_BACKUP",
	SET_LIBRARY_PAGE_BACKUP: "SET_LIBRARY_PAGE_BACKUP",
};

export const setSongPageBackup = (
	songPageBackup: TPageState["songPageBackup"]
): TAction => ({
	type: types.SET_SONG_PAGE_BACKUP,
	payload: { songPageBackup },
});
export const setSongPageBackupSong = (song: TSong): TAction => ({
	type: types.SET_SONG_PAGE_BACKUP_SONG,
	payload: { song },
});
export const setSongListPageBackup = (
	songListPageBackup: TPageState["songListPageBackup"]
): TAction => ({
	type: types.SET_SONG_LIST_PAGE_BACKUP,
	payload: { songListPageBackup },
});
export const setRepertoryPageBackup = (
	repertoryPageBackup: TPageState["repertoryPageBackup"]
): TAction => ({
	type: types.SET_REPERTORY_PAGE_BACKUP,
	payload: { repertoryPageBackup },
});
export const setRepertoryListPageBackup = (
	repertoryListPageBackup: TPageState["repertoryListPageBackup"]
): TAction => ({
	type: types.SET_REPERTORY_LIST_PAGE_BACKUP,
	payload: { repertoryListPageBackup },
});
export const setLibraryPageBackup = (
	libraryPageBackup: TPageState["libraryPageBackup"]
): TAction => ({
	type: types.SET_LIBRARY_PAGE_BACKUP,
	payload: { libraryPageBackup },
});

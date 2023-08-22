// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'

import { TSong } from "../song/types";
import { TPageActionPayload } from "./reducers";

// import { database } from "../../data/database.js";
export const types = {
	SET_SONG_PAGE_BACKUP: "SET_SONG_PAGE_BACKUP",
	SET_SONG_PAGE_BACKUP_SONG: "SET_SONG_PAGE_BACKUP_SONG",
	SET_SONG_LIST_PAGE_BACKUP: "SET_SONG_LIST_PAGE_BACKUP",
	SET_REPERTORY_PAGE_BACKUP: "SET_REPERTORY_PAGE_BACKUP",
	SET_REPERTORY_LIST_PAGE_BACKUP: "SET_REPERTORY_LIST_PAGE_BACKUP",
	SET_LIBRARY_PAGE_BACKUP: "SET_LIBRARY_PAGE_BACKUP",
} as const;

export const setSongPageBackup = (
	songPageBackup: TPageActionPayload["songPageBackup"]
) => ({
	type: types.SET_SONG_PAGE_BACKUP,
	payload: { songPageBackup },
});
export const setSongPageBackupSong = (song: TSong) => ({
	type: types.SET_SONG_PAGE_BACKUP_SONG,
	payload: { song },
});
export const setSongListPageBackup = (
	songListPageBackup: TPageActionPayload["songListPageBackup"]
) => ({
	type: types.SET_SONG_LIST_PAGE_BACKUP,
	payload: { songListPageBackup },
});
export const setRepertoryPageBackup = (
	repertoryPageBackup: TPageActionPayload["repertoryPageBackup"]
) => ({
	type: types.SET_REPERTORY_PAGE_BACKUP,
	payload: { repertoryPageBackup },
});
export const setRepertoryListPageBackup = (
	repertoryListPageBackup: TPageActionPayload["repertoryListPageBackup"]
) => ({
	type: types.SET_REPERTORY_LIST_PAGE_BACKUP,
	payload: { repertoryListPageBackup },
});
export const setLibraryPageBackup = (
	libraryPageBackup: TPageActionPayload["libraryPageBackup"]
) => ({
	type: types.SET_LIBRARY_PAGE_BACKUP,
	payload: { libraryPageBackup },
});

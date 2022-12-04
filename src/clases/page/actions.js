// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { types } from "./types"


export const setSongPageBackup = (songPageBackup) => ({
    type: types.SET_SONG_LIST_PAGE_BACKUP,
    payload: { songPageBackup }
})
export const setSongListPageBackup = (songListPageBackup) => ({
    type: types.SET_SONG_LIST_PAGE_BACKUP,
    payload: { songListPageBackup }
})
export const setLibraryPageBackup = (libraryPageBackup) => ({
    type: types.SET_LIBRARY_PAGE_BACKUP,
    payload: { libraryPageBackup }
})


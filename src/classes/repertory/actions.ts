// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TRootState } from "../../store.js";
import { errorMessage } from "../../utils/errors.js";
import { objIsEmpty } from "../../utils/generalUtils.js";
import { getPrivateSongTitleDB } from "../song/services/privateSongTitleList.js";
import { getPublicSongTitleDB } from "../song/services/publicSongTitleList.js";
import { TSong } from "../song/types.d";
import { TUserId } from "../user/types.d";
import { fetchRepertory, fetchRepertoryFailure, fetchRepertoryList, fetchRepertoryListFailure, fetchRepertoryListSuccess, fetchRepertorySuccess, TRepertoryState } from "./reducers.js";
import {
	getPrivateRepertoryListDB,
	getPrivateRepertoryDB,
} from "./services/privateRepertoryList.js";
import {
	getPublicRepertoryDB,
	getPublicRepertoryListDB,
} from "./services/publicRepertoryList.js";
import { TRepertory, TRepertoryId, TRepertoryList, TRepertoryTitles } from "./types.d";

export const types = {
	RESET_REPERTORY_ACTION_STATUS: "RESET_REPERTORY_ACTION_STATUS",

	SET_REPERTORY_LIST_STATUS: "SET_REPERTORY_LIST_STATUS",

	FETCH_REPERTORY_LIST: "FETCH_REPERTORY_LIST",
	FETCH_REPERTORY_LIST_SUCCESS: "FETCH_REPERTORY_LIST_SUCCESS",
	FETCH_REPERTORY_LIST_FAILURE: "FETCH_REPERTORY_LIST_FAILURE",

	SET_REPERTORY_STATUS: "SET_REPERTORY_STATUS",

	FETCH_REPERTORY: "FETCH_REPERTORY",
	FETCH_REPERTORY_SUCCESS: "FETCH_REPERTORY_SUCCESS",
	FETCH_REPERTORY_FAILURE: "FETCH_REPERTORY_FAILURE",

	CREATE_REPERTORY: "CREATE_REPERTORY",
	CREATE_REPERTORY_SUCCESS: "CREATE_REPERTORY_SUCCESS",
	CREATE_REPERTORY_FAILURE: "CREATE_REPERTORY_FAILURE",

	EDIT_REPERTORY: "EDIT_REPERTORY",
	EDIT_REPERTORY_SUCCESS: "EDIT_REPERTORY_SUCCESS",
	EDIT_REPERTORY_FAILURE: "EDIT_REPERTORY_FAILURE",

	// PUBLISH_REPERTORY: "PUBLISH_REPERTORY",
	// PUBLISH_REPERTORY_SUCCESS: "PUBLISH_REPERTORY_SUCCESS",
	// PUBLISH_REPERTORY_FAILURE: "PUBLISH_REPERTORY_FAILURE",

	DELETE_REPERTORY: "DELETE_REPERTORY",
	DELETE_REPERTORY_SUCCESS: "DELETE_REPERTORY_SUCCESS",
	DELETE_REPERTORY_FAILURE: "DELETE_REPERTORY_FAILURE",
} as const;

export const getRepertoryList = createAsyncThunk<void, 
	{ userId: TUserId; onlyAddPrivates?: boolean },{ state: TRootState }>(
		'repertory/getRepertoryList', async (
		{ userId, onlyAddPrivates = false }:{ userId: TUserId; onlyAddPrivates?: boolean }, { getState, dispatch }
	) => {
		try {
			dispatch(fetchRepertoryList());
			//////////////////////////////////////
			let publicRepertoryList;
			if (onlyAddPrivates) {
				publicRepertoryList = getState().repertory.repertoryList;
			} else {
				publicRepertoryList = await getPublicRepertoryListDB();
			}
			const userPrivateRepertoryList = await getPrivateRepertoryListDB({
				userId,
			});

			// Falta crear el createTRepertory
			const repertoryList = {
				...((publicRepertoryList as TRepertoryList) || {}),
				...((userPrivateRepertoryList as TRepertoryList) || {}),
			};

			//////////////////////////////////////
			dispatch(fetchRepertoryListSuccess({ repertoryList, userId }))
		} catch (error) {
			console.warn(error);
			dispatch(fetchRepertoryListFailure({ error: errorMessage(error), userId }))
		}
	}
)

export const getRepertory = createAsyncThunk<void, 
	{ userId: TUserId; repertoryId: TRepertoryId; },{ state: TRootState }>(
		'repertory/getRepertory', async (
		{ userId, repertoryId }, { getState, dispatch }
	) => {
		try {
			dispatch(fetchRepertory());
			//////////////////////////////

			const repertoryList = getState().repertory.repertoryList;
			if (objIsEmpty(repertoryList))
				throw new Error("Repertory not found (List).");
			let repertory: TRepertory = repertoryList[repertoryId] || null;

			if (!repertory) {
				const privateRepertory = await getPrivateRepertoryDB({
					userId,
					repertoryId,
					hasInvitation: true,
				});
				if (privateRepertory !== null) {
					repertory = { ...privateRepertory, isPrivate: true };
				}
			}
			if (!repertory) {
				const publicRepertory = await getPublicRepertoryDB({
					repertoryId,
				});
				if (publicRepertory !== null) {
					repertory = { ...publicRepertory, isPrivate: false };
				}
			}
			if (!repertory) throw new Error("Repertory not found (Title).");

			const returnSectionsWithSongTitles: Array<{
				name: string;
				songs: TSong[];
			}> = [];
			for (const [
				sectionIndex,
				{ name, songs },
			] of repertory.songSections.entries()) {
				returnSectionsWithSongTitles.push({ name, songs: [] });

				for (const songTitleId of songs) {
					let songTitle =
						getState().page.songListPageBackup.songList.find(
							(i) => i.id === songTitleId
						) || null;
					
					const songListFromBackup = getState().page.songPageBackup.songList?.[songTitleId]
					if (!songTitle && songListFromBackup)
						songTitle = songListFromBackup;
					if (!songTitle)
						songTitle = await getPrivateSongTitleDB({
							userId,
							songTitleId,
							hasInvitation: true,
						});
					if (!songTitle)
						songTitle = await getPublicSongTitleDB({ songTitleId });
					if (!songTitle) throw new Error("Song not found (Title).");

					returnSectionsWithSongTitles[sectionIndex]?.songs?.push(songTitle);
				}
			}

			// Falta el createTRepertory
			const returnRepertory: TRepertoryTitles = {
				...repertory,
				songSections: returnSectionsWithSongTitles,
			};

			//////////////////////////////
			dispatch(fetchRepertorySuccess({ repertory: returnRepertory, userId }))
		} catch (error) {
			console.warn(error);
			dispatch(fetchRepertoryFailure({ error: errorMessage(error), userId }))
		}
	}
)

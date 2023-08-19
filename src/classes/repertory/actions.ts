// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { TStoreState } from "../../store.js";
import { errorMessage } from "../../utils/errors.js";
import { arrayIsEmpty } from "../../utils/generalUtils.js";
import { TActionType, TDispatchType } from "../../utils/types.js";
import { getPrivateSongTitleDB } from "../song/services/privateSongTitleList.js";
import { getPublicSongTitleDB } from "../song/services/publicSongTitleList.js";
import { TSong } from "../song/types.js";
import { TUserId } from "../user/types.js";
import { TRepertoryState } from "./reducers.js";
import {
	getPrivateRepertoryListDB,
	getPrivateRepertoryDB,
} from "./services/privateRepertoryList.js";
import {
	getPublicRepertoryDB,
	getPublicRepertoryListDB,
} from "./services/publicRepertoryList.js";
import { TRepertoryId } from "./types.js";

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

	PUBLISH_REPERTORY: "PUBLISH_REPERTORY",
	PUBLISH_REPERTORY_SUCCESS: "PUBLISH_REPERTORY_SUCCESS",
	PUBLISH_REPERTORY_FAILURE: "PUBLISH_REPERTORY_FAILURE",

	DELETE_REPERTORY: "DELETE_REPERTORY",
	DELETE_REPERTORY_SUCCESS: "DELETE_REPERTORY_SUCCESS",
	DELETE_REPERTORY_FAILURE: "DELETE_REPERTORY_FAILURE",
};

export const resetRepertoryActionStatus = (): TActionType => ({
	type: types.RESET_REPERTORY_ACTION_STATUS,
});
export const setRepertoryListStatus = (
	repertoryListStatus: TRepertoryState["repertoryListStatus"]
): TActionType => ({
	type: types.SET_REPERTORY_LIST_STATUS,
	payload: { repertoryListStatus },
});
export const setRepertoryStatus = (
	repertoryStatus: TRepertoryState["repertoryStatus"]
): TActionType => ({
	type: types.SET_REPERTORY_STATUS,
	payload: { repertoryStatus },
});

// Thunks

export const getRepertoryList = (p: {
	userId: TUserId;
	onlyAddPrivates?: boolean;
}) => {
	const { userId, onlyAddPrivates = false } = p;
	return async (dispatch: TDispatchType, getState: () => TStoreState) => {
		try {
			dispatch({
				type: types.FETCH_REPERTORY_LIST,
				payload: { userId },
			});
			//////////////////////////////////////
			let publicRepertoryList;
			if (onlyAddPrivates) {
				publicRepertoryList = getState().repertory.repertoryList.reduce(
					(tO, e) => ({ ...tO, [e.id]: e }),
					{}
				);
			} else {
				publicRepertoryList = await getPublicRepertoryListDB();
			}
			const userPrivateRepertoryList = await getPrivateRepertoryListDB({
				userId,
			});

			const repertoryList = [
				...Object.values(publicRepertoryList || {}),
				...Object.values(userPrivateRepertoryList || {}),
			];

			//////////////////////////////////////
			dispatch({
				type: types.FETCH_REPERTORY_LIST_SUCCESS,
				payload: { repertoryList, userId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.FETCH_REPERTORY_LIST_FAILURE,
				payload: { error: errorMessage(error), userId },
			});
		}
	};
};

export const getRepertory = (p: {
	userId: TUserId;
	repertoryId: TRepertoryId;
}) => {
	const { userId, repertoryId } = p;
	return async (dispatch: TDispatchType, getState: () => TStoreState) => {
		try {
			dispatch({
				type: types.FETCH_REPERTORY,
				payload: { userId, repertoryId },
			});
			//////////////////////////////

			const repertoryList = getState().repertory.repertoryList;
			if (arrayIsEmpty(repertoryList))
				throw new Error("Repertory not found (List).");
			let repertory = repertoryList.find((i) => i.id === repertoryId) || null;

			if (!repertory) {
				const privateRepertory = await getPrivateRepertoryDB({
					userId,
					repertoryId,
					hasInvitation: true,
				});
				repertory = privateRepertory
					? { ...privateRepertory, isPrivate: true }
					: null;
			}
			if (!repertory) {
				const publicRepertory = await getPublicRepertoryDB({
					repertoryId,
				});
				repertory = publicRepertory
					? { ...publicRepertory, isPrivate: false }
					: null;
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
					if (!songTitle)
						songTitle = getState().page.songPageBackup.songList[songTitleId];
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
			const returnRepertory = {
				...repertory,
				songSections: returnSectionsWithSongTitles,
			};

			//////////////////////////////
			dispatch({
				type: types.FETCH_REPERTORY_SUCCESS,
				payload: { repertory: returnRepertory, userId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.FETCH_REPERTORY_FAILURE,
				payload: { error: errorMessage(error), userId },
			});
		}
	};
};

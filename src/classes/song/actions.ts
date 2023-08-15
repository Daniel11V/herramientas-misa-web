// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import {
	arrayIsEmpty,
	errorMessage,
	objsAreEqual,
} from "../../utils/generalUtils.js";
import { getLyricStart } from "../../utils/lyricsAndChordsUtils.js";
import {
	IActionType,
	IDispatchType,
	ISecurityStatusType,
} from "../../utils/types.js";
import { setSongPageBackupSong } from "../page/actions.js";
import {
	createPrivateSongLyricDB,
	deletePrivateSongLyricDB,
	editPrivateSongLyricDB,
	getPrivateSongLyricDB,
} from "./services/privateSongLyricList.js";
import {
	createPrivateSongTitleDB,
	deletePrivateSongTitleDB,
	editPrivateSongTitleDB,
	getPrivateSongTitleDB,
	getPrivateSongTitleListDB,
} from "./services/privateSongTitleList.js";
import {
	createPublicSongLyricDB,
	editPublicSongLyricDB,
	getPublicSongLyricDB,
} from "./services/publicSongLyricList.js";
import {
	createPublicSongTitleDB,
	editPublicSongTitleDB,
	getPublicSongTitleDB,
	getPublicSongTitleListDB,
} from "./services/publicSongTitleList.js";
import { IPrivateSongTitleDB, ISong, ISongForm } from "./types.js";
import { IUserDB } from "../user/types.js";
import { IStoreState } from "../../store.js";

export const types = {
	RESET_SONG_REQUEST_STATUS: "RESET_SONG_REQUEST_STATUS",

	SET_SONG_LIST_STATUS: "SET_SONG_LIST_STATUS",

	FETCH_SONG_LIST: "FETCH_SONG_LIST",
	FETCH_SONG_LIST_SUCCESS: "FETCH_SONG_LIST_SUCCESS",
	FETCH_SONG_LIST_FAILURE: "FETCH_SONG_LIST_FAILURE",

	SET_SONG_STATUS: "SET_SONG_STATUS",

	FETCH_SONG: "FETCH_SONG",
	FETCH_SONG_SUCCESS: "FETCH_SONG_SUCCESS",
	FETCH_SONG_FAILURE: "FETCH_SONG_FAILURE",

	FETCH_SONG_TITLE: "FETCH_SONG_TITLE",
	FETCH_SONG_TITLE_SUCCESS: "FETCH_SONG_TITLE_SUCCESS",
	FETCH_SONG_TITLE_FAILURE: "FETCH_SONG_TITLE_FAILURE",

	CREATE_SONG: "CREATE_SONG",
	CREATE_SONG_SUCCESS: "CREATE_SONG_SUCCESS",
	CREATE_SONG_FAILURE: "CREATE_SONG_FAILURE",

	EDIT_SONG: "EDIT_SONG",
	EDIT_SONG_SUCCESS: "EDIT_SONG_SUCCESS",
	EDIT_SONG_FAILURE: "EDIT_SONG_FAILURE",

	PUBLISH_SONG: "PUBLISH_SONG",
	PUBLISH_SONG_SUCCESS: "PUBLISH_SONG_SUCCESS",
	PUBLISH_SONG_FAILURE: "PUBLISH_SONG_FAILURE",

	DELETE_SONG: "DELETE_SONG",
	DELETE_SONG_SUCCESS: "DELETE_SONG_SUCCESS",
	DELETE_SONG_FAILURE: "DELETE_SONG_FAILURE",
};

export const resetSongRequestStatus = (): IActionType => ({
	type: types.RESET_SONG_REQUEST_STATUS,
});
export const setSongListStatus = (
	songListStatus: ISecurityStatusType
): IActionType => ({
	type: types.SET_SONG_LIST_STATUS,
	payload: { songListStatus },
});
export const setSongStatus = (
	songStatus: ISecurityStatusType
): IActionType => ({
	type: types.SET_SONG_LIST_STATUS,
	payload: { songStatus },
});

// Thunks

export const getSongList = (p: {
	userId: IUserDB["id"];
	onlyAddPrivates?: boolean;
}) => {
	const { userId, onlyAddPrivates = false } = p;

	return async (dispatch: IDispatchType, getState: () => IStoreState) => {
		try {
			dispatch({
				type: types.FETCH_SONG_LIST,
				payload: { userId },
			});
			//////////////////////////////////////
			let publicSongTitleList;
			if (onlyAddPrivates) {
				publicSongTitleList = getState().song.songList.reduce(
					(tO, e) => ({ ...tO, [e.id]: e }),
					{}
				);
			} else {
				publicSongTitleList = await getPublicSongTitleListDB();
			}
			const userPrivateSongTitleList = await getPrivateSongTitleListDB({
				userId,
			});

			const songList = [
				...Object.values(publicSongTitleList || {}),
				...Object.values(userPrivateSongTitleList || {}),
			];

			//////////////////////////////////////
			dispatch({
				type: types.FETCH_SONG_LIST_SUCCESS,
				payload: { songList, userId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.FETCH_SONG_LIST_FAILURE,
				payload: { error: errorMessage(error), userId },
			});
		}
	};
};

export const getSong = (p: {
	userId: IUserDB["id"];
	songTitleId: ISong["id"];
}) => {
	const { userId, songTitleId } = p;
	return async (dispatch: IDispatchType, getState: () => IStoreState) => {
		try {
			dispatch({
				type: types.FETCH_SONG,
				payload: { userId, songTitleId },
			});
			//////////////////////////////

			let songTitle = getState().song.songList.find(
				(i) => i.id === songTitleId
			);
			if (!songTitle)
				songTitle = await getPrivateSongTitleDB({
					userId,
					songTitleId,
					hasInvitation: true,
				});
			if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
			if (!songTitle) throw new Error("Song not found (Title).");

			let songLyric = {};
			if (songTitle?.lyricIsPrivate) {
				songLyric = await getPrivateSongLyricDB({
					songLyricId: songTitle?.lyricId,
				});
			} else {
				songLyric = await getPublicSongLyricDB({
					songLyricId: songTitle?.lyricId,
				});
			}

			if (!songLyric) throw new Error("Song not found (Lyric).");

			const song = { ...songTitle, ...songLyric };

			//////////////////////////////
			dispatch({
				type: types.FETCH_SONG_SUCCESS,
				payload: { song, userId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.FETCH_SONG_FAILURE,
				payload: { error: errorMessage(error), userId },
			});
		}
	};
};

export const getSongTitle = (p: {
	userId: IUserDB["id"];
	songTitleId: ISong["id"];
}) => {
	const { userId, songTitleId } = p;
	return async (dispatch: IDispatchType, getState: () => IStoreState) => {
		try {
			dispatch({
				type: types.FETCH_SONG_TITLE,
				payload: { userId, songTitleId },
			});
			//////////////////////////////

			let songTitle;
			const { songList } = getState().page.songListPageBackup;
			if (!arrayIsEmpty(songList))
				songTitle = songList.find((i) => i.id === songTitleId);

			if (!songTitle) {
				const { songList: songPageBackupList } = getState().page.songPageBackup;
				songTitle = songPageBackupList[songTitleId];
			}
			if (!songTitle)
				songTitle = await getPrivateSongTitleDB({
					userId,
					songTitleId,
					hasInvitation: true,
				});
			if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
			if (!songTitle) throw new Error("Song not found (Title).");

			//////////////////////////////
			dispatch({
				type: types.FETCH_SONG_TITLE_SUCCESS,
				payload: { songTitle, userId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.FETCH_SONG_TITLE_FAILURE,
				payload: { error: errorMessage(error), userId },
			});
		}
	};
};

export const createSong = (p: { songCreated: ISongForm }) => {
	const { songCreated } = p;

	// Siempre que se cree una canción por el momento se creará como privada y luego se podra publicar
	// Primero se crea el Lyric y luego el Title, colocando acá el id del Lyric y si es publico o privado.

	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.CREATE_SONG,
				payload: { songCreated },
			});
			//////////////////////////////////////

			const { lyric, ...songTitle } = songCreated;

			const songLyricCreatedId = await createPrivateSongLyricDB({
				lyric,
			});

			const songTitleCreatedId = new Date().getTime().toString();

			const songTitleCreated: IPrivateSongTitleDB = {
				id: songTitleCreatedId,
				versionGroupId: songTitleCreatedId,
				isPrivate: true,
				lyricId: songLyricCreatedId,
				lyricIsPrivate: true,
				lyricStart: getLyricStart(lyric),
				rating: [],
				level: {
					general: 0,
				},
				hasAccess: {},
				title: songTitle.title,
				author: songTitle.author,
				creator: songTitle.creator,
				labels: songTitle.labels,
				topics: songTitle.topics,
				annotations: songTitle.annotations,
				pulse: songTitle.pulse,
				tempo: songTitle.tempo,
			};

			// if (saveAsPublic) {
			//     const res = await createPublicSongTitleDB({ songCreated });
			//     songCreated.songId = res.id;
			//     await createPublicSongLyricDB({ songCreated });

			await createPrivateSongTitleDB({ songTitleCreated });
			const newSongCreatedByDB: ISong = {
				...songTitleCreated,
				lyric,
			};

			//////////////////////////////////////
			dispatch({
				type: types.CREATE_SONG_SUCCESS,
				payload: { songCreated: newSongCreatedByDB },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.CREATE_SONG_FAILURE,
				payload: { error: errorMessage(error) },
			});
		}
	};
};

export const editSong = (p: { songEdited: ISong; saveAsPublic?: boolean }) => {
	const { songEdited, saveAsPublic = false } = p;
	// Siempre que se edite una canción publica (incluso si es propia)
	// ... se creará una version privada privada que luego se podra publicar
	// Si ya era privada simplemente se actualiza

	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.EDIT_SONG,
				payload: { songEdited, saveAsPublic },
			});
			//////////////////////////////////////

			const { lyric, ...songTitleEdited } = songEdited;
			if (songTitleEdited.isPrivate) {
				await editPrivateSongTitleDB({ songTitleEdited });
			} else {
				await editPublicSongTitleDB({ songTitleEdited });
			}

			if (songTitleEdited.lyricIsPrivate) {
				await editPrivateSongLyricDB({
					lyricId: songTitleEdited.lyricId,
					lyric,
				});
			} else {
				await editPublicSongLyricDB({
					lyricId: songTitleEdited.lyricId,
					lyric,
				});
			}

			//////////////////////////////////////
			dispatch({
				type: types.EDIT_SONG_SUCCESS,
				payload: { songEdited },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.EDIT_SONG_FAILURE,
				payload: { error: errorMessage(error) },
			});
		}
	};
};
export const saveSongOptions = () => {
	return async (dispatch: IDispatchType, getState: () => IStoreState) => {
		try {
			const userId = getState().user.google.id;
			const { lyric, ...songTitle } = getState().song.song;

			if (songTitle.creator.id === userId) {
				const { tone, annotations, level } = getState().page.songPageBackup;
				const levelsInNumbers = {};
				for (const levelType in level) {
					levelsInNumbers[levelType] = Number(level[levelType]);
				}

				const songOptionsToSave = {};
				if (!!tone && songTitle?.tone !== tone) songOptionsToSave.tone = tone;
				if (annotations !== null && songTitle?.annotations !== annotations)
					songOptionsToSave.annotations = annotations;
				if (
					!!level?.general &&
					!objsAreEqual(songTitle?.level, levelsInNumbers)
				)
					songOptionsToSave.level = levelsInNumbers;

				if (!!Object.keys(songOptionsToSave)?.length) {
					const songTitleEdited = { ...songTitle, ...songOptionsToSave };
					await editPrivateSongTitleDB({ songTitleEdited });

					dispatch({
						type: types.EDIT_SONG_SUCCESS,
						payload: { songEdited: { ...songTitleEdited, lyric } },
					});
					dispatch(setSongPageBackupSong({ ...songTitleEdited, lyric }));
				}
			}

			//////////////////////////////////////
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.EDIT_SONG_FAILURE,
				payload: { error: errorMessage(error) },
			});
		}
	};
};

export const publishSong = (p: { songPublicId: ISong["id"] }) => {
	const { songPublicId } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.PUBLISH_SONG,
				payload: { songPublicId },
			});
			//////////////////////////////////////

			const oldSongTitleFromDB = await getPrivateSongTitleDB({
				songTitleId: songPublicId,
				hasInvitation: true,
			});
			await deletePrivateSongTitleDB({ songTitleId: songPublicId });
			const oldSongLyricFromDB = await getPrivateSongLyricDB({
				songLyricId: oldSongTitleFromDB.lyricId,
			});
			await deletePrivateSongLyricDB({
				songLyricId: oldSongTitleFromDB.lyricId,
			});

			const newSongLyricCreatedByDB = await createPublicSongLyricDB({
				lyric: oldSongLyricFromDB.lyric,
			});
			const newPublicSongTitle = {
				...oldSongTitleFromDB,
				isPrivate: false,
				lyricIsPrivate: false,
				lyricId: newSongLyricCreatedByDB.id,
			};
			const newSongTitleCreatedByDB = await createPublicSongTitleDB({
				songTitleCreated: newPublicSongTitle,
			});
			const newSongCreatedByDB = {
				...newSongLyricCreatedByDB,
				...newSongTitleCreatedByDB,
			};

			//////////////////////////////////////
			dispatch({
				type: types.PUBLISH_SONG_SUCCESS,
				payload: { newSongCreatedByDB },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.PUBLISH_SONG_FAILURE,
				payload: { error: errorMessage(error) },
			});
		}
	};
};

export const deleteSong = (p: {
	songDeletedId: ISong["id"];
	isPrivate?: boolean;
}) => {
	const { songDeletedId, isPrivate = false } = p;
	return async (dispatch: IDispatchType) => {
		try {
			dispatch({
				type: types.DELETE_SONG,
				payload: { songDeletedId, isPrivate },
			});
			//////////////////////////////////////

			if (isPrivate) {
				// deletePrivateSongTitleDB({ songDeletedId });
				// deletePrivateSongLyricDB({ songDeletedId });
			} else {
				// deletePublicSongTitleDB({ songDeletedId });
				// deletePublicSongLyricDB({ songDeletedId });
			}

			//////////////////////////////////////
			dispatch({
				type: types.DELETE_SONG_SUCCESS,
				payload: { songDeletedId },
			});
		} catch (error) {
			console.warn(error);
			dispatch({
				type: types.DELETE_SONG_FAILURE,
				payload: { error: errorMessage(error) },
			});
		}
	};
};

// import { child, ref, get, set, remove, push, onValue } from "firebase/database";
// import { db } from "../../database/firebase"
// import * as FileSystem from 'expo-file-system'
// import { database } from "../../data/database.js";
import { arrayIsEmpty, getRating, objsAreEqual } from "../../utils/generalUtils.js";
import { getLyricStart } from "../../utils/lyricsAndChordsUtils.js";
import {
	createPrivateSongLyricDB,
	deletePrivateSongLyricDB,
	editPrivateSongLyricDB,
	getPrivateSongLyricDB,
} from "./services/privateSongLyricList.js";
import {
	createPrivateSongTitleDB,
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
import {
	TPrivateSongLyricDB,
	TPrivateSongTitleDB,
	TPublicSongTitleDB,
	TSong,
	TSongForm,
	TSongId,
	TSongLevel,
	TSongList,
	TSongOptions,
	TVersionGroupId,
	TVersionGroups,
} from "./types.d";
import { TUserId } from "../user/types.d";
import {
	createTPrivateSongTitleDB,
	createTPublicSongTitleDB,
	createTSong,
} from "./createTypes.js";
import { errorMessage } from "../../utils/errors.js";
import { setSongPageBackupSong } from "../page/reducers.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { TRootState } from "../../store.js";
import { createSongFailure, createSongLoading, createSongSuccess, deleteSongFailure, deleteSongLoading, deleteSongSuccess, editSongFailure, editSongLoading, editSongSuccess, fetchSongFailure, getSongListFailure, getSongListLoading, getSongListSuccess, fetchSongLoading, fetchSongSuccess, publishSongFailure, publishSongLoading, publishSongSuccess } from "./reducers.js";

const groupBySongVersions = async (songList: TSong[], userId?: TUserId) => {
	const versionGroups: TVersionGroups = {};

	const mainLevel = (level: TSongLevel) =>
		Object.keys(level || {}).reduce(
			(newMainLevel, levelType) => newMainLevel + level[levelType],
			0
		);

	const swapMoreRated = (newSongId: TSongId, versionGroupId: TVersionGroupId) => {
		const lastMoreRatedSongId = versionGroups[versionGroupId].moreRated;
		versionGroups[versionGroupId].moreRated = newSongId;
		versionGroups[versionGroupId].versions.push(lastMoreRatedSongId);
	};

	songList.forEach((song) => {
		const currentVersionGroup = versionGroups[song.versionGroupId]
		if (currentVersionGroup) {
			const currentSongVersion =
				songList.find(s => s.id === currentVersionGroup.moreRated);
			const currentMaxLevel =
				currentVersionGroup.maxLevel || 0;

			if (
				song.creator.id === userId &&
				mainLevel(song.level) > currentMaxLevel
			) {
				swapMoreRated(song.id, song.versionGroupId);
				versionGroups[song.versionGroupId].maxLevel = mainLevel(
					song.level
				);
			} else if (
				getRating(song.rating) > getRating(currentSongVersion?.rating)
			) {
				swapMoreRated(song.id, song.versionGroupId);
			} else {
				versionGroups[song.versionGroupId].versions.push(song.id);
			}
		} else {
			versionGroups[song.versionGroupId] = {
				moreRated: song.id,
				maxLevel: song.creator.id === userId ? mainLevel(song.level) : 0,
				versions: [],
			};
		}
	});
	
	return songList.filter(
		(song) => versionGroups[song?.versionGroupId]?.moreRated === song.id
	);
}

const sortAlphabetically = (songList: TSong[]) => songList.sort((a, b) => a.title.localeCompare(b.title));


export const getSongList = createAsyncThunk<void,void,{ state: TRootState }>(
	'song/getSongList', async (_, { getState, dispatch }) => {
		try {
			dispatch(getSongListLoading());
			//////////////////////////////////////
			const userId = getState().user.google.id
			const publicSongTitleList = await getPublicSongTitleListDB();

			const userPrivateSongTitleList = userId
				? await getPrivateSongTitleListDB({
						userId,
					})
				: {};

			let songList: TSong[] = [
				...Object.values(publicSongTitleList || {}),
				...Object.values(userPrivateSongTitleList || {}),
			];

			if (songList.length > 1) {
				songList = await groupBySongVersions(songList)
				songList = sortAlphabetically(songList)
			}
			
			//////////////////////////////////////
			dispatch(getSongListSuccess({ songList, userId }))
		} catch (error) {
			console.warn(error);
			// return rejectWithValue({error: `GetSongList Error ${error || ''}`, userId})
			dispatch(getSongListFailure({ error: errorMessage(error) }))
		}
		
	}
);

export const updateSongInSongList = createAsyncThunk<void,{song: TSong; userId?: TUserId;},{state: TRootState}>(
	'song/getNewSongList',async ({ song, userId }, { getState, dispatch }) => {

		try {
			dispatch(getSongListLoading());
			//////////////////////////////////////
			let currentSongList = [...(getState().song.songList)]

			const songIndex = currentSongList.findIndex( s => s.id === song.id );
			if (songIndex) currentSongList.splice( songIndex, 1 );
			currentSongList.push(song)
			
			if (currentSongList.length > 1) {
				currentSongList = await groupBySongVersions(currentSongList)
				currentSongList = sortAlphabetically(currentSongList)
			}
			
			//////////////////////////////////////
			dispatch(getSongListSuccess({ songList: currentSongList, userId }))
		} catch (error) {
			console.warn(error);
			// return rejectWithValue({error: `GetSongList Error ${error || ''}`, userId})
			dispatch(getSongListFailure({ error: errorMessage(error) }))
		}
		
	}
);

// export const getSongList = createAsyncThunk<
// 	void,
// 	{ userId?: TUserId;	onlyAddPrivates?: boolean },
// 	{ state: TRootState }>(
// 	'song/getSongList',
// 	async (
// 		{ userId, onlyAddPrivates = false }, 
// 		{ 
// 			getState, 
// 			dispatch, 
// 			// rejectWithValue 
// 		}
// 	) => {

// 		try {
// 			dispatch(getSongListLoading());
// 			//////////////////////////////////////
// 			let publicSongTitleList;
// 			if (onlyAddPrivates) {
// 				publicSongTitleList = getState().song.songList;
// 			} else {
// 				publicSongTitleList = await getPublicSongTitleListDB();
// 			}
// 			const userPrivateSongTitleList = userId
// 				? await getPrivateSongTitleListDB({
// 						userId,
// 					})
// 				: {};

// 			const songList: TSongList = {
// 				...(publicSongTitleList || {}),
// 				...(userPrivateSongTitleList || {}),
// 			};

// 			//////////////////////////////////////
// 			dispatch(getSongListSuccess({ songList, userId }))
// 		} catch (error) {
// 			console.warn(error);
// 			// return rejectWithValue({error: `GetSongList Error ${error || ''}`, userId})
// 			dispatch(getSongListFailure({ error: errorMessage(error), userId }))
// 		}
		
// 	}
// );

// Thunks
// export const getSongList = (p: {
// 	userId?: TUserId;
// 	onlyAddPrivates?: boolean;
// }) => {
// 	const { userId, onlyAddPrivates = false } = p;

// 	return async (dispatch: TDispatch, getState: () => TStoreState) => {
// 		try {
// 			dispatch({
// 				type: types.FETCH_SONG_LIST,
// 			});
// 			//////////////////////////////////////
// 			let publicSongTitleList;
// 			if (onlyAddPrivates) {
// 				publicSongTitleList = getState().song.songList;
// 			} else {
// 				publicSongTitleList = await getPublicSongTitleListDB();
// 			}
// 			const userPrivateSongTitleList = userId
// 				? await getPrivateSongTitleListDB({
// 						userId,
// 				  })
// 				: {};

// 			const songList = {
// 				...(publicSongTitleList || {}),
// 				...(userPrivateSongTitleList || {}),
// 			};

// 			//////////////////////////////////////
// 			dispatch({
// 				type: types.FETCH_SONG_LIST_SUCCESS,
// 				payload: { songList, userId },
// 			});
// 		} catch (error) {
// 			console.warn(error);
// 			dispatch({
// 				type: types.FETCH_SONG_LIST_FAILURE,
// 				payload: { error: errorMessage(error), userId },
// 			});
// 		}
// 	};
// };

export const getSong = createAsyncThunk<void, 
	{ userId: TUserId; songTitleId: TSongId },{ state: TRootState }>(
		'song/getSong', async (
		{ userId, songTitleId }, { getState, dispatch }
	) => {
		try {
			dispatch(fetchSongLoading());

			//////////////////////////////

			let	songTitle: TSong = await getPrivateSongTitleDB({
				userId,
				songTitleId,
				hasInvitation: true,
			});
			if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
			if (!songTitle) throw new Error("Song not found (Title).");

			let songLyric: TPrivateSongLyricDB | null = null;
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
			dispatch(fetchSongSuccess({ song, userId }))
			
			dispatch(updateSongInSongList({ song, userId }))
			
		} catch (error) {
			console.warn(error);
			dispatch(fetchSongFailure({ error: errorMessage(error) }))
		}
	}
);


// export const getSongTitle = (p: { userId: TUserId; songTitleId: TSongId }) => {
// 	const { userId, songTitleId } = p;
// 	return async (dispatch: TDispatch, getState: () => TStoreState) => {
// 		try {
// 			dispatch({
// 				type: types.FETCH_SONG_TITLE,
// 				payload: { userId, songTitleId },
// 			});
// 			//////////////////////////////

// 			let songTitle;
// 			const { songList } = getState().page.songListPageBackup;
// 			if (!arrayIsEmpty(songList))
// 				songTitle = songList.find((i) => i.id === songTitleId);

// 			if (!songTitle) {
// 				const { songList: songPageBackupList } = getState().page.songPageBackup;
// 				songTitle = songPageBackupList[songTitleId];
// 			}
// 			if (!songTitle)
// 				songTitle = await getPrivateSongTitleDB({
// 					userId,
// 					songTitleId,
// 					hasInvitation: true,
// 				});
// 			if (!songTitle) songTitle = await getPublicSongTitleDB({ songTitleId });
// 			if (!songTitle) throw new Error("Song not found (Title).");

// 			//////////////////////////////
// 			dispatch({
// 				type: types.FETCH_SONG_TITLE_SUCCESS,
// 				payload: { songTitle, userId },
// 			});
// 		} catch (error) {
// 			console.warn(error);
// 			dispatch({
// 				type: types.FETCH_SONG_TITLE_FAILURE,
// 				payload: { error: errorMessage(error), userId },
// 			});
// 		}
// 	};
// };

export const createSong = createAsyncThunk<void, { songCreated: TSongForm }>(
	'song/createSong',
	async ({ songCreated }, { dispatch }) => {

		// Siempre que se cree una canción por el momento se creará como privada y luego se podra publicar
		// Primero se crea el Lyric y luego el Title, colocando acá el id del Lyric y si es publico o privado.

		try {
			dispatch(createSongLoading());

			//////////////////////////////////////

			const { lyric, ...songTitle } = songCreated;

			const songLyricCreatedId = await createPrivateSongLyricDB({
				lyric,
			});

			const songTitleCreatedId = new Date().getTime().toString();

			const songTitleCreated: TPrivateSongTitleDB = {
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
				privateAccess: {},
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
			const newSongCreatedByDB: TSong = {
				...songTitleCreated,
				lyric,
			};

			//////////////////////////////////////
			dispatch(createSongSuccess({ songCreated: newSongCreatedByDB }))
		} catch (error) {
			console.warn(error);
			dispatch(createSongFailure({ error: errorMessage(error) }))
		}
	}
);

export const editSong = createAsyncThunk<void, 
	{ songEdited: TSong; saveAsPublic?: boolean }>(
		'song/editSong', async (
		{ songEdited, saveAsPublic = false}, { dispatch }
	) => {
	// Siempre que se edite una canción publica (incluso si es propia)
	// ... se creará una version privada privada que luego se podra publicar
	// Si ya era privada simplemente se actualiza
		try {
			dispatch(editSongLoading());

			//////////////////////////////////////

			const { lyric, privateAccess, ...songTitleEdited } = songEdited;
			if (privateAccess) {
				await editPrivateSongTitleDB({
					songTitleEdited: {
						...songTitleEdited,
						privateAccess,
					},
				});
			} else {
				await editPublicSongTitleDB({ songTitleEdited });
			}

			if (!!lyric) {
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
			}

			//////////////////////////////////////
			dispatch(editSongSuccess({ songEdited }))
		} catch (error) {
			console.warn(error);
			dispatch(editSongFailure({ error: errorMessage(error) }))
		}
	}
);
	
	
export const saveSongOptions = createAsyncThunk<void, void, { state: TRootState }>(
		'song/saveSongOptions', async (_, { getState, dispatch }
	) => {
		try {
			const userId = getState().user.google.id;
			const { lyric, ...songTitle } = getState().song.song;

			if (songTitle.creator.id === userId) {
				const { tone, annotations, level } = getState().page.songPageBackup;
				const levelsInNumbers: TSongOptions["level"] = { general: 1 };
				for (const levelType in level) {
					levelsInNumbers[levelType] = Number(level[levelType]);
				}

				const songOptionsToSave: TSongOptions = {};
				if (!!tone && songTitle?.tone !== tone) songOptionsToSave.tone = tone;
				if (annotations !== null && songTitle?.annotations !== annotations)
					songOptionsToSave.annotations = annotations;
				if (
					!!level?.general &&
					!objsAreEqual(songTitle?.level, levelsInNumbers)
				)
					songOptionsToSave.level = levelsInNumbers;

				if (!!Object.keys(songOptionsToSave)?.length) {
					const songTitleEdited: TPrivateSongTitleDB =
						createTPrivateSongTitleDB({
							...songTitle,
							...songOptionsToSave,
						});
					await editPrivateSongTitleDB({ songTitleEdited });

					const song = createTSong({ ...songTitleEdited, lyric });

					dispatch(editSongSuccess({ songEdited: song }))
					dispatch(setSongPageBackupSong({song}));
				}
			}

			//////////////////////////////////////
		} catch (error) {
			console.warn(error);
			// dispatch(editSongFailure({ error: errorMessage(error) }))
		}
	}
)

export const publishSong = createAsyncThunk<void, 
	{ privateSongId: TSongId }>(
		'song/publishSong', async (
		{ privateSongId }, { dispatch }
	) => {
		try {
			dispatch(publishSongLoading());

			//////////////////////////////////////

			// Se copia el PrivateTitleSong y se pega en public
			// const privateSong = getState().song.songList.find(
			// 	(song) => song.id === privateSongId
			// );

			const oldSongTitleFromDB = await getPrivateSongTitleDB({
				songTitleId: privateSongId,
				hasInvitation: true,
			});
			// await deletePrivateSongTitleDB({ songTitleId: privateSongId });
			const oldSongLyricFromDB = await getPrivateSongLyricDB({
				songLyricId: oldSongTitleFromDB.lyricId,
			});
			await deletePrivateSongLyricDB({
				songLyricId: oldSongTitleFromDB.lyricId,
			});

			const newSongLyricCreatedByDBId = await createPublicSongLyricDB({
				lyric: oldSongLyricFromDB.lyric,
			});
			const newPublicSongTitle: TPublicSongTitleDB = createTPublicSongTitleDB({
				...oldSongTitleFromDB,
				isPrivate: false,
				lyricIsPrivate: false,
				lyricId: newSongLyricCreatedByDBId,
			});
			const newSongTitleCreatedByDBId = await createPublicSongTitleDB({
				songTitleCreated: newPublicSongTitle,
			});
			const newSongCreatedByDB: TSong = createTSong({
				...newPublicSongTitle,
				lyric: oldSongLyricFromDB.lyric,
				id: newSongTitleCreatedByDBId,
			});

			//////////////////////////////////////
			dispatch(publishSongSuccess({ songCreated: newSongCreatedByDB }))
		} catch (error) {
			console.warn(error);
			dispatch(publishSongFailure({ error: errorMessage(error) }))
		}
	}
)

export const deleteSong = createAsyncThunk<void, 
	{ songDeletedId: TSongId; isPrivate?: boolean; }>(
		'song/deleteSong', async (
		{ songDeletedId, isPrivate = false}, { dispatch }
	) => {
		try {
			dispatch(deleteSongLoading());

			//////////////////////////////////////

			if (isPrivate) {
				// deletePrivateSongTitleDB({ songDeletedId });
				// deletePrivateSongLyricDB({ songDeletedId });
			} else {
				// deletePublicSongTitleDB({ songDeletedId });
				// deletePublicSongLyricDB({ songDeletedId });
			}

			//////////////////////////////////////
			dispatch(deleteSongSuccess({ songDeletedId }))
		} catch (error) {
			console.warn(error);
			dispatch(deleteSongFailure({ error: errorMessage(error) }))
		}
	}
)

import { useState, useEffect, startTransition, useMemo, useRef } from "react";
import {
	getSongList,
} from "../../../classes/song/actions";
import { MAX_RETRYS } from "../../../configs";
import { FETCH_STATUS, SECURITY_STATUS, SONG_LIST_TYPE } from "../../../utils/types.d";
import { arrayIsEmpty, getRating } from "../../../utils/generalUtils";
import { TSong, TSongId, TSongLevel, TVersionGroupId, TVersionGroups } from "../../../classes/song/types.d";
import { TUserId } from "../../../classes/user/types.d";
import { TRootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { resetSongRequestStatus, setSongListStatus } from "../../../classes/song/reducers";
import { setSongListPageBackup } from "../../../classes/page/reducers";

export const useSongListPage = () => {
	const dispatch = useAppDispatch();

	const userId = useSelector((state: TRootState) => state.user.google.id);
	const {
		songList,
		songListStatus,
		songListType,
		songListError,
		// songListUserId,
		// songRequestStatus,
	} = useSelector((state: TRootState) => state.song);
	// const songListPageBackup = useSelector((state: TRootState) => state.page.songListPageBackup);
	// const { songList: songListBackup } = songListPageBackup;

	// type TStep =
	// 	| "INITIAL"
	// 	| "FETCH_SONG_LIST_1"
	// 	| "WITH_SONG_LIST_1"
	// 	| "FORMAT_BY_VERSION_GROUPS_2"
	// 	| "FINISHED";
	// const steps: Record<TStep, TStep> = {
	// 	INITIAL: "INITIAL",
	// 	FETCH_SONG_LIST_1: "FETCH_SONG_LIST_1",
	// 	WITH_SONG_LIST_1: "WITH_SONG_LIST_1",
	// 	FORMAT_BY_VERSION_GROUPS_2: "FORMAT_BY_VERSION_GROUPS_2",
	// 	FINISHED: "FINISHED",
	// };
	// const [status, setCurrentSongListStatus] = useState<{
	// 	step: TStep,
	// 	opts: {
	// 		userId?: TUserId,
	// 		isSameBackup?: boolean,
	// 		fromFetch?: boolean
	// 	}
	// }>({
	// 	step: steps.INITIAL,
	// 	opts: {},
	// });
	// const [retrys, setRetrys] = useState<number>(0);

	const isLoadingGetSongList = useRef(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [filteredSongList, setFilteredSongList] = useState<TSong[]>([])

	console.log("ACA RERENDER", {isLoadingGetSongList, error, isLoading, filteredSongList})
	console.log("ACA RERENDER2", {songList,
		songListStatus,
		songListType,
		songListError})
	
	// const setStatus = (statusStep: TStep, statusOpts = {}) => {
	// 	setIsLoading(true);
	// 	console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
	// 	setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
	// };
	
	useEffect(() => {
		if (!isLoadingGetSongList) return
		
		if (songListStatus === FETCH_STATUS.FAILURE) {
			console.log("ACA SongListError", songListError)
			setError(songListError)
			isLoadingGetSongList.current = false
		}
		if (songListStatus === FETCH_STATUS.SUCCESS) {
			console.log("ACA SongList", songList)
			setFilteredSongList(songList)
			isLoadingGetSongList.current = false
			setIsLoading(false)
		}
	}, [songList, songListError, isLoadingGetSongList])
	
	// useEffect(() => {
	// 	if (songListError) {
			
	// 	}
	// }, [songListError])
	
	useEffect(() => {
		const shouldUpdateSongList = (): boolean => {
			if (songListType === SONG_LIST_TYPE.INITIAL) return true
			if (songListType === SONG_LIST_TYPE.SHOULD_UPDATE) return true
			if (songListType === SONG_LIST_TYPE.PUBLIC && userId) return true
			if (songListType === SONG_LIST_TYPE.PRIVATE && !userId) return true
			return false
		}
		
		if (shouldUpdateSongList()) {
			setIsLoading(true)
			isLoadingGetSongList.current = true
			dispatch(getSongList());
		}
	}, [songListType, userId, dispatch]);

	// useEffect(() => {
	// 	if (status.step === steps.FETCH_SONG_LIST_1) {
	// 		if (songRequestStatus === FETCH_STATUS.INITIAL) {
	// 			console.log("ACA getSongList")
	// 			dispatch(getSongList(status.opts));
	// 			setRetrys(0);
	// 		} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
	// 			console.log("ACA getSongList Success")
				
	// 			setStatus(steps.WITH_SONG_LIST_1, { fromFetch: true });
	// 			// dispatch(resetSongRequestStatus());
	// 		} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
	// 			console.log("ACA getSongList Failure")
				
	// 			if (retrys === MAX_RETRYS) {
	// 				setStatus(steps.FINISHED);
	// 				dispatch(resetSongRequestStatus());
	// 			} else {
	// 				setRetrys((lastRetrys) => lastRetrys + 1);
	// 				dispatch(getSongList(status.opts));
	// 			}
	// 		}
	// 	}
	// 	/* 
    //         Cancionero:
    //         - Canciones de otros publicas
    //         - Si hay varias versiones mostrar la mia publica o privada
    //         - Mis canciones publicas (y privadas?)
    //         - En codigo: publicSongTitles + privateSongTitles, dejando una por versiones
    //         Mi Biblioteca:
    //         - Mis canciones privadas y publicas

    //         Al colocar en Favoritas una publicSongTitle de otro:
    //         - crea un privateSongTitle de esa que apunta al detalle de la publica, si 
    //         se edita algo de Lyric se crea nueva Lyric en private
    //     */
	// }, [status.step, status.opts, songRequestStatus, retrys, dispatch]);

	// useEffect(() => {
	// 	if (status.step === steps.WITH_SONG_LIST_1) {
	// 		console.log("ACA status.step === steps.WITH_SONG_LIST_1")
	// 		setCurrentSongList(Object.values(songList));
	// 		setStatus(steps.FORMAT_BY_VERSION_GROUPS_2);
	// 	}
	// }, [status.step, songList]);

	// useEffect(() => {
	// 	if (status.step === steps.FORMAT_BY_VERSION_GROUPS_2) {
	// 		console.log("ACA status.step === steps.FORMAT_BY_VERSION_GROUPS_2")
			
	// 		if (!arrayIsEmpty(currentSongList)) {
	// 			// FORMAT_BY_VERSION_GROUPS"
	// 			const versionGroups: TVersionGroups = {};

	// 			const mainLevel = (level: TSongLevel) =>
	// 				Object.keys(level || {}).reduce(
	// 					(newMainLevel, levelType) => newMainLevel + level[levelType],
	// 					0
	// 				);

	// 			const swapMoreRated = (newSongId: TSongId, versionGroupId: TVersionGroupId) => {
	// 				const lastMoreRatedSongId = versionGroups[versionGroupId].moreRated;
	// 				versionGroups[versionGroupId].moreRated = newSongId;
	// 				versionGroups[versionGroupId].versions.push(lastMoreRatedSongId);
	// 			};

	// 			currentSongList.forEach((song) => {
	// 				const currentVersionGroup = versionGroups[song.versionGroupId]
	// 				if (currentVersionGroup) {
	// 					const currentSongVersion =
	// 						currentSongList.find(s => s.id === currentVersionGroup.moreRated);
	// 					const currentMaxLevel =
	// 						currentVersionGroup.maxLevel || 0;

	// 					if (
	// 						song.creator.id === userId &&
	// 						mainLevel(song.level) > currentMaxLevel
	// 					) {
	// 						swapMoreRated(song.id, song.versionGroupId);
	// 						versionGroups[song.versionGroupId].maxLevel = mainLevel(
	// 							song.level
	// 						);
	// 					} else if (
	// 						getRating(song.rating) > getRating(currentSongVersion?.rating)
	// 					) {
	// 						swapMoreRated(song.id, song.versionGroupId);
	// 					} else {
	// 						versionGroups[song.versionGroupId].versions.push(song.id);
	// 					}
	// 				} else {
	// 					versionGroups[song.versionGroupId] = {
	// 						moreRated: song.id,
	// 						maxLevel: song.creator.id === userId ? mainLevel(song.level) : 0,
	// 						versions: [],
	// 					};
	// 				}
	// 			});
	// 			const finalSongList = currentSongList.filter(
	// 				(song) => versionGroups[song?.versionGroupId]?.moreRated === song.id
	// 			);

	// 			// ORDER_ALPHABETICALLY
	// 			finalSongList.sort((a, b) => a.title.localeCompare(b.title));

	// 			setCurrentSongList(finalSongList);
	// 		}
	// 		setStatus(steps.FINISHED);
	// 	}
	// }, [status.step, currentSongList, userId, dispatch]);

	// useEffect(() => {
	// 	if (status.step === steps.FINISHED && !!isLoading) {
	// 		console.log("ACA status.step === steps.FINISHED && !!isLoading")
	// 		setFinalSongList(currentSongList);
	// 		if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
	// 			dispatch(setSongListPageBackup({songListPageBackup: { songList: currentSongList }}));
	// 		}
	// 		setIsLoading(false);
	// 	}
	// }, [status, isLoading, currentSongList, retrys, dispatch]);
	
	const result = useMemo(() => ({
		songList: filteredSongList,
		loadingSongList: isLoading,
		errorSongList: error,
	}), [filteredSongList, isLoading, error]);

	return result;
};

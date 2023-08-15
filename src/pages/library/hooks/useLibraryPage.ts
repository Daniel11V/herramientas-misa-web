import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLibraryPageBackup } from "../../../classes/page/actions";
import {
	getSongList,
	resetSongRequestStatus,
	setSongListStatus,
} from "../../../classes/song/actions";
import { IStoreState } from "../../../store";
import { fetchStatus, securityStatus } from "../../../utils/types";
import { arrayIsEmpty, objIsEmpty } from "../../../utils/generalUtils";

export const useLibraryPage = () => {
	const dispatch = useDispatch();

	const userId = useSelector((state: IStoreState) => state.user.google.id);
	const {
		songList,
		songListStatus,
		songListUserId,
		songRequestStatus,
		songError,
	} = useSelector((state: IStoreState) => state.song);
	const { libraryPageBackup } = useSelector((state: IStoreState) => state.page);
	const { songList: songListBackup } = libraryPageBackup;

	type IStep =
		| "INITIAL"
		| "FETCH_SONG_LIST_1"
		| "WITH_SONG_LIST_1"
		| "FORMAT_BY_VERSION_GROUPS_2"
		| "FINISHED";
	const steps: Record<IStep, IStep> = {
		INITIAL: "INITIAL",
		FETCH_SONG_LIST_1: "FETCH_SONG_LIST_1",
		WITH_SONG_LIST_1: "WITH_SONG_LIST_1",
		FORMAT_BY_VERSION_GROUPS_2: "FORMAT_BY_VERSION_GROUPS_2",
		FINISHED: "FINISHED",
	};
	const [status, setCurrentSongListStatus] = useState({
		step: steps.INITIAL,
		opts: {},
	});
	const [currentSongList, setCurrentSongList] = useState([]);

	const [finalSongList, setFinalSongList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const setStatus = (statusStep: IStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (songListStatus === securityStatus.INITIAL) {
			setStatus(steps.FETCH_SONG_LIST_1, { isFirst: true, userId });
		} else if (songListStatus === securityStatus.SHOULD_UPDATE) {
			setStatus(steps.WITH_SONG_LIST_1);
			dispatch(
				setSongListStatus(
					songListUserId ? securityStatus.PRIVATE : securityStatus.PUBLIC
				)
			);
		} else if (userId && songListUserId !== userId) {
			setStatus(steps.FETCH_SONG_LIST_1, { userId });
		} else if (!userId && songListStatus === securityStatus.PRIVATE) {
			setStatus(steps.FETCH_SONG_LIST_1);
		} else if (status.step === steps.INITIAL) {
			if (!objIsEmpty(songListBackup)) {
				setCurrentSongList(songListBackup);
				setStatus("FINISHED", { isSameBackup: true });
			} else {
				setStatus("FETCH_SONG_LIST_1");
			}
		}
	}, [
		songListStatus,
		songListUserId,
		userId,
		songListBackup,
		status.step,
		dispatch,
	]);

	useEffect(() => {
		if (status.step === steps.FETCH_SONG_LIST_1) {
			if (songRequestStatus === fetchStatus.INITIAL) {
				dispatch(getSongList(status.opts));
			} else if (songRequestStatus === fetchStatus.SUCCESS) {
				setStatus(steps.WITH_SONG_LIST_1, { fromFetch: true });
				dispatch(resetSongRequestStatus());
			} else if (songRequestStatus === fetchStatus.FAILURE) {
				setStatus(steps.FINISHED);
				dispatch(resetSongRequestStatus());
			}
		}
		/* 
            Cancionero:
            - Canciones de otros publicas
            - Si hay varias versiones mostrar la mia publica o privada
            - Mis canciones publicas
            - En codigo: publicSongTitles + privateSongTitles, dejando una por versiones
            Mi Biblioteca:
            - Mis canciones privadas y publicas
            - 

            publicSongTitles
            En Favoritos una:
            - crea un privateSongTitles de esa que apunta al detalle de la publica, si 
            se edita algo de Lyric se crea nueva Lyric en private
        */
	}, [status, songRequestStatus, dispatch]);

	useEffect(() => {
		if (status.step === steps.WITH_SONG_LIST_1) {
			setCurrentSongList(songList);
			setStatus(steps.FORMAT_BY_VERSION_GROUPS_2);
		}
	}, [status, songList]);

	useEffect(() => {
		if (status.step === steps.FORMAT_BY_VERSION_GROUPS_2) {
			if (!arrayIsEmpty(currentSongList)) {
				const versionGroups = {
					// $versionGroupId: {
					//     moreRated: $songId,
					//     maxLevel: 0,
					//     versions: [ $songId, ... ],
					// }
				};

				const mainLevel = (level) =>
					Object.keys(level || {}).reduce(
						(newMainLevel, levelType) => newMainLevel + level[levelType],
						0
					);

				const swapMoreRated = (newSongId, versionGroupId) => {
					const lastMoreRatedSongId = versionGroups[versionGroupId].moreRated;
					versionGroups[versionGroupId].moreRated = newSongId;
					versionGroups[versionGroupId].versions.push(lastMoreRatedSongId);
				};

				currentSongList
					.filter((i) => i.creator?.id === userId)
					.forEach((song) => {
						if (versionGroups[song.versionGroupId]) {
							const currentSongVersion =
								currentSongList[versionGroups[song.versionGroupId].moreRated];
							const currentMaxLevel =
								versionGroups[song.versionGroupId].maxLevel || 0;

							if (
								song.creator.id === userId &&
								mainLevel(song.level) > currentMaxLevel
							) {
								swapMoreRated(song.id, song.versionGroupId);
								versionGroups[song.versionGroupId].maxLevel = mainLevel(
									song.level
								);
							} else if (
								getRating(song.rating) > getRating(currentSongVersion.rating)
							) {
								swapMoreRated(song.id, song.versionGroupId);
							} else {
								versionGroups[song.versionGroupId].versions.push(song.id);
							}
						} else {
							versionGroups[song.versionGroupId] = {
								moreRated: song.id,
								maxLevel:
									song.creator.id === userId ? mainLevel(song.level) : 0,
								versions: [],
							};
						}
					});

				setCurrentSongList(
					currentSongList.filter(
						(song) => versionGroups[song?.versionGroupId]?.moreRated === song.id
					)
				);
				setStatus(steps.FINISHED);
			}
		}
	}, [status.step, currentSongList, userId, dispatch]);

	useEffect(() => {
		if (status.step === steps.FINISHED) {
			setFinalSongList(currentSongList);
			if (!status.opts.isSameBackup) {
				dispatch(setLibraryPageBackup({ songList: currentSongList }));
			}
			setIsLoading(false);
		}
	}, [status, currentSongList, dispatch]);

	return [finalSongList, isLoading, songError];
};

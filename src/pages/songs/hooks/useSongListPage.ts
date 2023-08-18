import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getSongList,
	resetSongRequestStatus,
	setSongListStatus,
} from "../../../classes/song/actions";
import { setSongListPageBackup } from "../../../classes/page/actions";
import { MAX_RETRYS } from "../../../configs";
import { TStoreState } from "../../../store";
import { FETCH_STATUS, SECURITY_STATUS } from "../../../utils/types";
import { arrayIsEmpty, getRating } from "../../../utils/generalUtils";

export const useSongListPage = () => {
	const dispatch = useDispatch();

	const userId = useSelector((state: TStoreState) => state.user.google.id);
	const {
		songList,
		songListStatus,
		songListUserId,
		songRequestStatus,
		songError,
	} = useSelector((state: TStoreState) => state.song);
	const { songListPageBackup } = useSelector(
		(state: TStoreState) => state.page
	);
	const { songList: songListBackup } = songListPageBackup;

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
	const [retrys, setRetrys] = useState(0);
	const [currentSongList, setCurrentSongList] = useState([]);

	const [finalSongList, setFinalSongList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	const setStatus = (statusStep: IStep, statusOpts = {}) => {
		setIsLoading(true);
		// console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (songError) setError(songError);
	}, [songError]);

	useEffect(() => {
		// if (songListStatus === "INITIAL") {
		//     setStatus("FETCH_SONG_LIST_1", { isFirst: true, userId });

		if (songListStatus === SECURITY_STATUS.SHOULD_UPDATE) {
			setStatus(steps.WITH_SONG_LIST_1);
			dispatch(
				setSongListStatus(
					songListUserId ? SECURITY_STATUS.PRIVATE : SECURITY_STATUS.PUBLIC
				)
			);
		} else if (userId && songListUserId !== userId) {
			setStatus(steps.FETCH_SONG_LIST_1, { userId });
		} else if (!userId && songListStatus === SECURITY_STATUS.PRIVATE) {
			setStatus(steps.FETCH_SONG_LIST_1);
		} else if (status.step === steps.INITIAL) {
			if (!arrayIsEmpty(songListBackup)) {
				setCurrentSongList(songListBackup);
				setStatus(steps.FINISHED, { isSameBackup: true });
			} else {
				setStatus(steps.FETCH_SONG_LIST_1, { userId });
			}
		}
	}, [
		songListStatus,
		songListUserId,
		status.step,
		userId,
		songListBackup,
		dispatch,
	]);

	useEffect(() => {
		if (status.step === steps.FETCH_SONG_LIST_1) {
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				dispatch(getSongList(status.opts));
				setRetrys(0);
			} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
				setStatus(steps.WITH_SONG_LIST_1, { fromFetch: true });
				dispatch(resetSongRequestStatus());
			} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetSongRequestStatus());
				} else {
					setRetrys((lastRetrys) => lastRetrys + 1);
					dispatch(getSongList(status.opts));
				}
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
	}, [status, songRequestStatus, retrys, dispatch]);

	useEffect(() => {
		if (status.step === steps.WITH_SONG_LIST_1) {
			setCurrentSongList(songList);
			setStatus(steps.FORMAT_BY_VERSION_GROUPS_2);
		}
	}, [status, songList]);

	useEffect(() => {
		if (status.step === steps.FORMAT_BY_VERSION_GROUPS_2) {
			if (!arrayIsEmpty(currentSongList)) {
				// FORMAT_BY_VERSION_GROUPS"
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

				currentSongList.forEach((song) => {
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
							maxLevel: song.creator.id === userId ? mainLevel(song.level) : 0,
							versions: [],
						};
					}
				});
				const finalSongList = currentSongList.filter(
					(song) => versionGroups[song?.versionGroupId]?.moreRated === song.id
				);

				// ORDER_ALPHABETICALLY
				finalSongList.sort((a, b) => a.title.localeCompare(b.title));

				setCurrentSongList(finalSongList);
			}
			setStatus(steps.FINISHED);
		}
	}, [status.step, currentSongList, userId, dispatch]);

	useEffect(() => {
		if (status.step === steps.FINISHED && !!isLoading) {
			setFinalSongList(currentSongList);
			if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
				dispatch(setSongListPageBackup({ songList: currentSongList }));
			}
			setIsLoading(false);
		}
	}, [status, isLoading, currentSongList, retrys, dispatch]);

	return [finalSongList, isLoading, error];
};

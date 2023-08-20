import { useEffect, useState } from "react";
import { setLibraryPageBackup } from "../../../classes/page/actions";
import {
	getSongList,
	resetSongRequestStatus,
	setSongListStatus,
} from "../../../classes/song/actions";
import { FETCH_STATUS, SECURITY_STATUS } from "../../../utils/types";
import {
	arrayIsEmpty,
	getRating,
	objIsEmpty,
} from "../../../utils/generalUtils";
import { TSong, TSongId } from "../../../classes/song/types";
import { TUserId } from "../../../classes/user/types";
import { useAppDispatch, useAppSelector } from "../../../store";

export const useLibraryPage = () => {
	const dispatch = useAppDispatch();

	const userId = useAppSelector((state) => state.user.google.id);
	const {
		songList,
		songListStatus,
		songListUserId,
		songRequestStatus,
		songError,
	} = useAppSelector((state) => state.song);
	const { libraryPageBackup } = useAppSelector((state) => state.page);
	const { songList: songListBackup } = libraryPageBackup;

	type TStep =
		| "INITIAL"
		| "FETCH_SONG_LIST_1"
		| "WITH_SONG_LIST_1"
		| "FORMAT_BY_VERSION_GROUPS_2"
		| "FINISHED";
	const steps: Record<TStep, TStep> = {
		INITIAL: "INITIAL",
		FETCH_SONG_LIST_1: "FETCH_SONG_LIST_1",
		WITH_SONG_LIST_1: "WITH_SONG_LIST_1",
		FORMAT_BY_VERSION_GROUPS_2: "FORMAT_BY_VERSION_GROUPS_2",
		FINISHED: "FINISHED",
	};
	type TStatus = {
		step: TStep;
		opts: {
			userId?: TUserId;
			onlyAddPrivates?: boolean;
			isFirst?: boolean;
			isSameBackup?: boolean;
			fromFetch?: boolean;
			// songTitleId?: TSongId;
			// edittedSong?: TSongForm;
		};
	};
	const [status, setCurrentSongListStatus] = useState<TStatus>({
		step: steps.INITIAL,
		opts: {},
	});
	const [currentSongList, setCurrentSongList] = useState<TSong[]>([]);

	const [finalSongList, setFinalSongList] = useState<TSong[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const setStatus = (
		statusStep: TStatus["step"],
		statusOpts: TStatus["opts"] = {}
	) => {
		setIsLoading(true);
		// console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (songListStatus === SECURITY_STATUS.INITIAL) {
			setStatus(steps.FETCH_SONG_LIST_1, { isFirst: true, userId });
		} else if (songListStatus === SECURITY_STATUS.SHOULD_UPDATE) {
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
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				const { onlyAddPrivates, userId } = status.opts;
				if (onlyAddPrivates && userId) {
					dispatch(getSongList({ userId, onlyAddPrivates }));
				}
			} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
				setStatus(steps.WITH_SONG_LIST_1, { fromFetch: true });
				dispatch(resetSongRequestStatus());
			} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
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
				const versionGroups: Record<
					TSong["versionGroupId"],
					{
						moreRated: TSongId;
						maxLevel: number;
						versions: TSongId[];
					}
				> = {};

				const mainLevel = (level: TSong["level"]) =>
					Object.keys(level || {}).reduce(
						(newMainLevel, levelType) => newMainLevel + level[levelType],
						0
					);

				const swapMoreRated = (
					newSongId: TSongId,
					versionGroupId: TSong["versionGroupId"]
				) => {
					const lastMoreRatedSongId = versionGroups[versionGroupId].moreRated;
					versionGroups[versionGroupId].moreRated = newSongId;
					versionGroups[versionGroupId].versions.push(lastMoreRatedSongId);
				};

				currentSongList
					.filter((i) => i.creator?.id === userId)
					.forEach((song) => {
						if (versionGroups[song.versionGroupId]) {
							const currentSongVersion = currentSongList.find(
								(s) => s.id === versionGroups[song.versionGroupId].moreRated
							);
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
								getRating(song.rating) >
								getRating(currentSongVersion?.rating || [])
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
				dispatch(
					setLibraryPageBackup({ songList: currentSongList, repertoryList: [] })
				);
			}
			setIsLoading(false);
		}
	}, [status, currentSongList, dispatch]);

	return { songList: finalSongList, isLoading, songError };
};

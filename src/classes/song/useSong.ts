import { useEffect, useState } from "react";
import { setSongPageBackupSong } from "../page/actions";
import {
	editSong as editSongAction,
	getSong,
	resetSongRequestStatus,
} from "./actions";
import { TSong, TSongForm, TSongId } from "./types";
import { MAX_RETRYS } from "../../configs";
import { useAppSelector } from "../../store";
import { TUserId } from "../user/types";
import { FETCH_STATUS, SECURITY_STATUS } from "../../utils/types";
import { createTSong } from "./createTypes";
import { useDispatch } from "react-redux";

interface IUseSong {
	song?: TSong | null;
	isLoadingFetchSong: boolean;
	isLoadingEditSong: boolean;
	errorSong: string;
	editSong: (edittedSong: TSongForm) => void;
}

export const useSong = (p: {
	songTitleId: TSongId;
	userId: TUserId;
}): IUseSong => {
	const { songTitleId, userId } = p;
	const dispatch = useDispatch();

	const { song, songStatus, songUserId, songRequestStatus, songError } =
		useAppSelector((state) => state.song);
	const songListBackup = useAppSelector(
		(state) => state.page.songPageBackup.songList
	);

	type TStep = "INITIAL" | "FETCH_SONG_1" | "EDIT_SONG" | "FINISHED";
	const steps: Record<TStep, TStep> = {
		INITIAL: "INITIAL",
		FETCH_SONG_1: "FETCH_SONG_1",
		EDIT_SONG: "EDIT_SONG",
		FINISHED: "FINISHED",
	};
	type TStatus = {
		step: TStep;
		opts: {
			userId?: TUserId;
			songTitleId?: TSongId;
			edittedSong?: TSongForm;
		};
	};
	const [status, setCurrentSongListStatus] = useState<TStatus>({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentSong, setCurrentSong] = useState<TSong | null>(null);

	const [isLoadingFetchSong, setIsLoadingFetchSong] = useState(true);
	const [isLoadingEditSong, setIsLoadingEditSong] = useState(false);
	const [errorSong, setError] = useState<string>("");

	useEffect(() => {
		if (songError) setError(songError);
	}, [songError]);

	const setStatus = (
		statusStep: TStatus["step"],
		statusOpts: TStatus["opts"] = {}
	) => {
		// setIsLoadingFetchSong(true);
		// console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
		setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
	};

	useEffect(() => {
		if (userId && songUserId !== userId) {
			setStatus(steps.FETCH_SONG_1, { userId, songTitleId });
		} else if (!userId && songStatus === SECURITY_STATUS.PRIVATE) {
			setStatus(steps.FETCH_SONG_1, { songTitleId });
		} else if (status.step === steps.INITIAL) {
			if (!!songListBackup[songTitleId]) {
				const selectedSong = songListBackup[songTitleId];
				setCurrentSong(selectedSong);
				dispatch(setSongPageBackupSong(selectedSong));
				setStatus(steps.FINISHED);
			} else {
				setStatus(steps.FETCH_SONG_1, { userId, songTitleId });
			}
		}
	}, [
		songTitleId,
		songStatus,
		songUserId,
		status.step,
		userId,
		songListBackup,
		dispatch,
	]);

	useEffect(() => {
		if (status.step === steps.FETCH_SONG_1) {
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				const { songTitleId, userId } = status.opts;
				if (songTitleId && userId) {
					dispatch(getSong({ songTitleId, userId }));
					setRetrys(0);
				}
			} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
				setCurrentSong(song);
				setStatus(steps.FINISHED);
				dispatch(resetSongRequestStatus());
			} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setError("Max retrys fetching song");
					setStatus(steps.FINISHED);
					dispatch(resetSongRequestStatus());
				} else {
					const { songTitleId, userId } = status.opts;
					if (songTitleId && userId) {
						setRetrys((lastRetrys) => lastRetrys + 1);
						dispatch(getSong({ songTitleId, userId }));
					}
				}
			}
		}
	}, [status, songRequestStatus, retrys, dispatch, song]);

	useEffect(() => {
		if (status.step === steps.FINISHED) {
			setIsLoadingFetchSong(false);
			setIsLoadingEditSong(false);
		}
	}, [status]);

	const editSong = (edittedSong: TSongForm) => {
		setIsLoadingEditSong(true);
		setStatus(steps.EDIT_SONG, { edittedSong });
	};

	useEffect(() => {
		if (status.step === steps.EDIT_SONG) {
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				const { edittedSong } = status.opts;
				if (edittedSong) {
					const songEdited = createTSong({ ...edittedSong });
					dispatch(editSongAction({ songEdited }));
					setRetrys(0);
				}
			} else if (songRequestStatus === FETCH_STATUS.SUCCESS) {
				setCurrentSong(song);
				// setSongOptions({ tone: song.tone, annotations: song.annotations, level: song.level })
				setStatus(steps.FINISHED);
				dispatch(resetSongRequestStatus());
			} else if (songRequestStatus === FETCH_STATUS.FAILURE) {
				if (retrys === MAX_RETRYS) {
					setStatus(steps.FINISHED);
					dispatch(resetSongRequestStatus());
				} else {
					setRetrys((lastRetrys) => lastRetrys + 1);
					const { edittedSong } = status.opts;
					if (edittedSong) {
						const songEdited = createTSong({ ...edittedSong });
						dispatch(editSongAction({ songEdited }));
					}
				}
			}
		}
	}, [status, songRequestStatus, retrys, dispatch, song]);

	return {
		song: currentSong,
		isLoadingFetchSong,
		isLoadingEditSong,
		errorSong,
		editSong,
	};
};

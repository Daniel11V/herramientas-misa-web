import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongPageBackupSong } from "../page/actions";
import {
	editSong as editSongAction,
	getSong,
	resetSongRequestStatus,
} from "./actions";
import { TSong, TSongId } from "./types";
import { MAX_RETRYS } from "../../configs";
import { TStoreState } from "../../store";
import { TUserId } from "../user/types";
import { FETCH_STATUS, SECURITY_STATUS } from "../../utils/types";

interface IUseSong {
	song: TSong;
	isLoadingFetchSong: boolean;
	isLoadingEditSong: boolean;
	errorSong: boolean;
	editSong: (song: TSong) => void;
}

export const useSong = (p: {
	songTitleId: TSongId;
	userId: TUserId;
}): IUseSong => {
	const { songTitleId, userId } = p;
	const dispatch = useDispatch();

	const { song, songStatus, songUserId, songRequestStatus, songError } =
		useSelector((state: TStoreState) => state.song);
	const songListBackup = useSelector(
		(state: TStoreState) => state.page.songPageBackup.songList
	);

	type IStep = "INITIAL" | "FETCH_SONG_1" | "EDIT_SONG" | "FINISHED";
	const steps: Record<IStep, IStep> = {
		INITIAL: "INITIAL",
		FETCH_SONG_1: "FETCH_SONG_1",
		EDIT_SONG: "EDIT_SONG",
		FINISHED: "FINISHED",
	};
	const [status, setCurrentSongListStatus] = useState({
		step: steps.INITIAL,
		opts: {},
	});
	const [retrys, setRetrys] = useState(0);
	const [currentSong, setCurrentSong] = useState<TSong>(null);

	const [isLoadingFetchSong, setIsLoadingFetchSong] = useState(true);
	const [isLoadingEditSong, setIsLoadingEditSong] = useState(false);
	const [errorSong, setError] = useState(false);

	useEffect(() => {
		if (songError) setError(songError);
	}, [songError]);

	const setStatus = (statusStep: IStep, statusOpts = {}) => {
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
				dispatch(getSong(status.opts));
				setRetrys(0);
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
					setRetrys((lastRetrys) => lastRetrys + 1);
					dispatch(getSong(status.opts));
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

	const editSong = (edittedSong) => {
		setIsLoadingEditSong(true);
		setStatus(steps.EDIT_SONG, edittedSong);
	};

	useEffect(() => {
		if (status.step === steps.EDIT_SONG) {
			if (songRequestStatus === FETCH_STATUS.INITIAL) {
				dispatch(editSongAction(status.opts));
				setRetrys(0);
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
					dispatch(editSongAction(status.opts));
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

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAX_RETRYS } from "../../../configs";
import { editSong as editSongAction, getSong, resetSongRequestStatus } from "../../../clases/song/actions";
import { setSongPageBackupSong } from "../../../clases/page/actions";

export const useSong = (songTitleId, userId) => {
    const dispatch = useDispatch();

    const { song, songStatus, songUserId, songRequestStatus, songError } = useSelector((state) => state.song);
    const songListBackup = useSelector((state) => state.page.songPageBackup.songList);

    const [status, setCurrentSongListStatus] = useState({ step: "INITIAL", opts: {} });
    const [retrys, setRetrys] = useState(0);
    const [currentSong, setCurrentSong] = useState({});


    const [isLoadingFetchSong, setIsLoadingFetchSong] = useState(true);
    const [isLoadingEditSong, setIsLoadingEditSong] = useState(false);
    const [errorSong, setError] = useState(false);

    useEffect(() => {
        if (songError) setError(songError);
    }, [songError])

    const setStatus = (statusStep, statusOpts = {}) => {
        // setIsLoadingFetchSong(true);
        // console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
        setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
    }

    useEffect(() => {
        if (userId && songUserId !== userId) {
            setStatus("1_FETCH_SONG", { userId, songTitleId });

        } else if (!userId && songStatus === "PRIVATE") {
            setStatus("1_FETCH_SONG", { songTitleId });

        } else if (status.step === "INITIAL") {
            if (!!songListBackup[songTitleId]) {
                const selectedSong = songListBackup[songTitleId];
                setCurrentSong(selectedSong);
                dispatch(setSongPageBackupSong(selectedSong))
                setStatus("FINISHED");
            } else {
                setStatus("1_FETCH_SONG", { userId, songTitleId });
            }
        }
    }, [songTitleId, songStatus, songUserId, status.step, userId, songListBackup, dispatch])

    useEffect(() => {
        if (status.step === "1_FETCH_SONG") {
            if (songRequestStatus === "INITIAL") {
                dispatch(getSong(status.opts));
                setRetrys(0);
            } else if (songRequestStatus === "SUCCESS") {
                setCurrentSong(song);
                setStatus("FINISHED");
                dispatch(resetSongRequestStatus());
            } else if (songRequestStatus === "FAILURE") {
                if (retrys === MAX_RETRYS) {
                    setError("Max retrys fetching song")
                    setStatus("FINISHED");
                    dispatch(resetSongRequestStatus());
                } else {
                    setRetrys(lastRetrys => lastRetrys + 1);
                    dispatch(getSong(status.opts));
                }
            }
        }
    }, [status, songRequestStatus, retrys, dispatch, song]);

    useEffect(() => {
        if (status.step === "FINISHED") {
            setIsLoadingFetchSong(false);
            setIsLoadingEditSong(false);
        }
    }, [status])


    const editSong = (edittedSong) => {
        setIsLoadingEditSong(true);
        setStatus("EDIT_SONG", edittedSong);
    }

    useEffect(() => {
        if (status.step === "EDIT_SONG") {
            if (songRequestStatus === "INITIAL") {
                dispatch(editSongAction(status.opts));
                setRetrys(0);
            } else if (songRequestStatus === "SUCCESS") {
                setCurrentSong(song);
                // setSongOptions({ tone: song.tone, annotations: song.annotations, level: song.level })
                setStatus("FINISHED");
                dispatch(resetSongRequestStatus());
            } else if (songRequestStatus === "FAILURE") {
                if (retrys === MAX_RETRYS) {
                    setStatus("FINISHED");
                    dispatch(resetSongRequestStatus());
                } else {
                    setRetrys(lastRetrys => lastRetrys + 1);
                    dispatch(editSongAction(status.opts));
                }
            }
        }
    }, [status, songRequestStatus, retrys, dispatch, song]);

    return {
        song: currentSong, isLoadingFetchSong, isLoadingEditSong, errorSong, editSong
    };
};
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAX_RETRYS } from "../../../configs";
import { getSong, publishSong, resetSongActionStatus } from "../../../clases/song/actions";
import { setSongPageBackup } from "../../../clases/page/actions";

export const useSongPage = (songTitleId) => {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.user.google.id);
    const { song, songStatus, songUserId, songActionStatus, songError } = useSelector((state) => state.song);
    const { songPageBackup } = useSelector((state) => state.page);
    const { songList: songListBackup } = songPageBackup;

    const [status, setCurrentSongListStatus] = useState({ step: "INITIAL", opts: {} });
    const [retrys, setRetrys] = useState(0);
    const [currentSong, setCurrentSong] = useState({});


    const [finalSong, setFinalSong] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (songError) setError(songError);
    }, [songError])

    const setStatus = (statusStep, statusOpts = {}) => {
        setIsLoading(true);
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
                setCurrentSong(songListBackup[songTitleId]);
                setStatus("FINISHED", { isSameBackup: true });
            } else {
                setStatus("1_FETCH_SONG", { userId, songTitleId });
            }
        }
    }, [songTitleId, songStatus, songUserId, status.step, userId, songListBackup])

    useEffect(() => {
        if (status.step === "1_FETCH_SONG") {
            if (songActionStatus === "INITIAL") {
                dispatch(getSong(status.opts));
                setRetrys(0);
            } else if (songActionStatus === "SUCCESS") {
                setStatus("1_WITH_SONG", { fromFetch: true });
                dispatch(resetSongActionStatus());
            } else if (songActionStatus === "FAILURE") {
                if (retrys === MAX_RETRYS) {
                    setStatus("FINISHED");
                    dispatch(resetSongActionStatus());
                } else {
                    setRetrys(lastRetrys => lastRetrys + 1);
                    dispatch(getSong(status.opts));
                }
            }
        }
    }, [status, songActionStatus, retrys, dispatch]);

    useEffect(() => {
        if (status.step === "1_WITH_SONG") {
            setCurrentSong(song);
            setStatus("FINISHED");
        }
    }, [status, song]);

    useEffect(() => {
        if (status.step === "FINISHED" && !!isLoading) {
            setFinalSong(currentSong);
            if (!status.opts.isSameBackup && retrys !== MAX_RETRYS) {
                dispatch(setSongPageBackup(currentSong))
            }
            setIsLoading(false);
        }
    }, [status, isLoading, currentSong, retrys, dispatch])


    // useEffect(() => {
    //     setStatus("1_SONG");
    // }, [])

    // useEffect(() => {
    //     if (status === "1_SONG") {
    //         if (!songTitleId) {
    //             setStatus("FINISHED");
    //         } else if (song.id === songTitleId) {
    //             setCurrentSong(song);
    //             setStatus("FINISHED");
    //         } else if (retrys < MAX_RETRYS) {
    //             setStatus("1_FETCH_SONG");
    //             setRetrys(retrys + 1);
    //         } else {
    //             setError("Sin conexión, pruebe recargando la página.")
    //             setStatus("FINISHED");
    //         }
    //     }
    // }, [status, song, songTitleId, retrys])

    // useEffect(() => {
    //     if (status === "1_FETCH_SONG") {
    //         if (songActionStatus === "INITIAL") {
    //             dispatch(getSong({ userId, songTitleId }));
    //         } else if (songActionStatus === "SUCCESS") {
    //             setStatus("1_SONG");
    //             dispatch(resetSongActionStatus());
    //             setError(null);
    //         } else if (songActionStatus === "FAILURE") {
    //             setStatus("FINISHED");
    //             dispatch(resetSongActionStatus());
    //         }
    //     }
    // }, [status, songActionStatus, userId, songTitleId, dispatch]);

    // useEffect(() => {
    //     if (userId && !currentSong.id) {
    //         setStatus("1_SONG");
    //     }
    // }, [userId, currentSong]);

    const publishCurrentSong = () => {
        dispatch(publishSong(songTitleId));
    }

    return { song: finalSong, isLoading, error, publishCurrentSong };
};
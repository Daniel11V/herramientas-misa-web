import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MAX_RETRYS } from "../../../configs";
import { getSong, publishSong, resetSongActionStatus } from "../../../clases/song/actions";

export const useSongPage = (songId) => {
    const dispatch = useDispatch();

    const [currentSong, setCurrentSong] = useState({});
    const [status, setCurrentSongStatus] = useState("INITIAL");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const userId = useSelector((state) => state.user.google.id);
    const { song, songActionStatus, songError } = useSelector((state) => state.song);
    const [retrys, setRetrys] = useState(0);

    const setStatus = (newStatus) => {
        // console.log("ACA SONG_ACTION_STATUS: ", newStatus);
        setCurrentSongStatus(newStatus);
    }

    useEffect(() => {
        setIsLoading(status !== "FINISHED");
    }, [status])

    useEffect(() => {
        if (songError) setError(songError);
    }, [songError])

    useEffect(() => {
        setStatus("1_SONG");
    }, [])

    useEffect(() => {
        if (status === "1_SONG") {
            if (!songId) {
                setStatus("FINISHED");
            } else if (song.id === songId) {
                setCurrentSong(song);
                setStatus("FINISHED");
            } else if (retrys < MAX_RETRYS) {
                setStatus("1_FETCH_SONG");
                setRetrys(retrys + 1);
            } else {
                setError("Sin conexión, pruebe recargando la página.")
                setStatus("FINISHED");
            }
        }
    }, [status, song, songId, retrys])

    useEffect(() => {
        if (status === "1_FETCH_SONG") {
            if (songActionStatus === "INITIAL") {
                dispatch(getSong({ userId, songId }));
            } else if (songActionStatus === "SUCCESS") {
                setStatus("1_SONG");
                dispatch(resetSongActionStatus());
                setError(null);
            } else if (songActionStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongActionStatus());
            }
        }
    }, [status, songActionStatus, userId, songId, dispatch]);

    useEffect(() => {
        if (userId && !currentSong.id) {
            setStatus("1_SONG");
        }
    }, [userId, currentSong]);

    const publishCurrentSong = () => {
        dispatch(publishSong());
    }

    return { song: currentSong, isLoading, error, publishCurrentSong };
};
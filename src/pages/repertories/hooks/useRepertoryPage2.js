import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSongList, resetSongActionStatus, setSongListStatus } from "../../../clases/song/actions";
import { objIsEmpty } from "../../../utils";
import { getRepertory } from "../../../clases/repertory/actions";

export const useRepertoryPage2 = (repertoryId) => {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.user.google.id);
    const { repertory, repertoryStatus, error } = useSelector((state) => state.repertory);
    const { songList, songListStatus, songListUserId, songActionStatus, songError } = useSelector((state) => state.song);
    const { songListPageBackup } = useSelector((state) => state.page);
    const { songList: repertorySongListBackup } = songListPageBackup;

    const [status, setCurrentSongListStatus] = useState({ step: "INITIAL", opts: {} });
    const [currentRepertorySongList, setCurrentRepertorySongList] = useState([]);

    const [finalSongList, setFinalSongList] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const setStatus = (statusStep, statusOpts = {}) => {
        setIsLoading(true);
        // console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
        setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
    }

    useEffect(() => {
        if (songListStatus === "INITIAL") {
            dispatch(getRepertory({ userId, repertoryId }));
            setStatus("1_FETCH_SONG_LIST", { isFirst: true, userId });

        } else if (songListStatus === "SHOULD_UPDATE") {
            setStatus("1_WITH_SONG_LIST");
            dispatch(setSongListStatus(songListUserId ? "PRIVATE" : "PUBLIC"))

        } else if (userId && songListUserId !== userId) {
            setStatus("1_FETCH_SONG_LIST", { userId });

        } else if (!userId && songListStatus === "PRIVATE") {
            setStatus("1_FETCH_SONG_LIST");

        } else if (status.step === "INITIAL") {
            if (!objIsEmpty(repertorySongListBackup)) {
                setCurrentRepertorySongList(repertorySongListBackup);
                setStatus("FINISHED", { isSameBackup: true });
            } else {
                setStatus("1_FETCH_SONG_LIST");
            }
        }
    }, [songListStatus, songListUserId, status.step, repertoryId, userId, repertorySongListBackup, dispatch])

    useEffect(() => {
        if (status.step === "1_FETCH_SONG_LIST") {
            if (songActionStatus === "INITIAL") {
                dispatch(getSongList(status.opts));
            } else if (songActionStatus === "SUCCESS") {
                setStatus("1_WITH_SONG_LIST", { fromFetch: true });
                dispatch(resetSongActionStatus());
            } else if (songActionStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongActionStatus());
            }
        }
    }, [status, songActionStatus, dispatch]);

    useEffect(() => {
        if (status.step === "1_WITH_SONG_LIST") {
            const newRepertorySongList = {};
            for (const key in repertory?.songs) {
                for (const songId of repertory?.songs?.[key]) {
                    const newSong = songList.find(song => song.id === songId)
                    newRepertorySongList[key] = [...(newRepertorySongList[key] || []), newSong]
                }
            }

            setCurrentRepertorySongList(newRepertorySongList);
            setStatus("FINISHED");
        }
    }, [status, songList, repertory?.songs]);

    useEffect(() => {
        if (status.step === "FINISHED") {
            setFinalSongList(currentRepertorySongList);
            setIsLoading(false);
        }
    }, [status, currentRepertorySongList])

    return [repertory, isLoading, songError, finalSongList];
};
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSongList, resetSongActionStatus, setSongListStatus } from "../../../clases/song/actions";
import { setSongListPageBackup } from "../../../clases/page/actions";
import { arrayIsEmpty, getRating, objIsEmpty } from "../../../utils";
import { getRepertory } from "../../../clases/repertory/actions";

export const useRepertoryPage2 = (repertoryId) => {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.user.google.id);
    const { repertory, repertoryStatus, error } = useSelector((state) => state.repertory);
    const { songList, songListStatus, songListUserId, songActionStatus, songError } = useSelector((state) => state.song);
    const { songListPageBackup } = useSelector((state) => state.page);
    const { songList: songListBackup } = songListPageBackup;

    const [status, setCurrentSongListStatus] = useState({ step: "INITIAL", opts: {} });
    const [currentSongList, setCurrentSongList] = useState([]);

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
            if (!objIsEmpty(songListBackup)) {
                setCurrentSongList(songListBackup);
                setStatus("FINISHED", { isSameBackup: true });
            } else {
                setStatus("1_FETCH_SONG_LIST");
            }
        }
    }, [songListStatus, songListUserId, status.step, userId, songListBackup, dispatch])

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
    }, [status, songActionStatus, dispatch]);

    useEffect(() => {
        if (status.step === "1_WITH_SONG_LIST") {
            setCurrentSongList(songList);
            setStatus("FINISHED");
        }
    }, [status, songList]);

    useEffect(() => {
        if (status.step === "FINISHED") {
            const newSongList = {};
            for (const key in repertory?.songs) {
                for (const songId of repertory?.songs?.[key]) {
                    const newSong = currentSongList.find(song => song.id === songId)
                    newSongList[key] = [...(newSongList[key] || []), newSong]
                }
            }
            setFinalSongList(newSongList);
            setIsLoading(false);
        }
    }, [status, currentSongList, dispatch])

    return [repertory, isLoading, songError, finalSongList];
};
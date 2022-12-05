import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSongList, resetSongActionStatus, setSongListStatus } from "../../../clases/song/actions";
import { setSongListPageBackup } from "../../../clases/page/actions";
import { arrayIsEmpty, getRating, objIsEmpty } from "../../../utils";

export const useSongListPage = () => {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.user.google.id);
    const { songList, songListStatus, songListUserId, songActionStatus, songError } = useSelector((state) => state.song);
    const { songListPageBackup } = useSelector((state) => state.page);
    const { songList: songListBackup } = songListPageBackup;

    const [status, setCurrentSongListStatus] = useState({ step: "INITIAL", opts: {} });
    const [currentSongList, setCurrentSongList] = useState([]);

    const [finalSongList, setFinalSongList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const setStatus = (statusStep, statusOpts = {}) => {
        setIsLoading(true);
        // console.log("ACA SONG_LIST_STATUS: ", statusStep, statusOpts);
        setCurrentSongListStatus({ step: statusStep, opts: statusOpts });
    }

    useEffect(() => {
        if (songListStatus === "INITIAL") {
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
            setStatus("2_FORMAT_BY_VERSION_GROUPS");
        }
    }, [status, songList]);

    useEffect(() => {
        if (status.step === "2_FORMAT_BY_VERSION_GROUPS") {
            if (!arrayIsEmpty(currentSongList)) {

                const versionGroups = {
                    // $versionGroupId: {
                    //     moreRated: $songId,
                    //     maxLevel: 0,
                    //     versions: [ $songId, ... ],
                    // }
                };

                const swapMoreRated = (newSongId, versionGroupId) => {
                    const lastMoreRatedSongId = versionGroups[versionGroupId].moreRated;
                    versionGroups[versionGroupId].moreRated = newSongId;
                    versionGroups[versionGroupId].versions.push(lastMoreRatedSongId)
                }

                currentSongList.forEach(song => {
                    if (versionGroups[song.versionGroupId]) {
                        const currentSongVersion = currentSongList[versionGroups[song.versionGroupId].moreRated];
                        const currentMaxLevel = versionGroups[song.versionGroupId].maxLevel || 0;

                        if (song.creator.id === userId && song.level.main > currentMaxLevel) {
                            swapMoreRated(song.id, song.versionGroupId);
                            versionGroups[song.versionGroupId].maxLevel = song.level.main;
                        } else if (getRating(song.rating) > getRating(currentSongVersion.rating)) {
                            swapMoreRated(song.id, song.versionGroupId);
                        } else {
                            versionGroups[song.versionGroupId].versions.push(song.id)
                        }
                    } else {
                        versionGroups[song.versionGroupId] = {
                            moreRated: song.id,
                            maxLevel: song.creator.id === userId ? song.level.main : 0,
                            versions: [],
                        }
                    }

                })

                setCurrentSongList(currentSongList.filter(song => versionGroups[song?.versionGroupId]?.moreRated === song.id));
                setStatus("FINISHED");
            }
        }

    }, [status.step, currentSongList, userId, dispatch])

    useEffect(() => {
        if (status.step === "FINISHED") {
            setFinalSongList(currentSongList);
            if (!status.opts.isSameBackup) {
                dispatch(setSongListPageBackup({ songList: currentSongList }))
            }
            setIsLoading(false);
        }
    }, [status, currentSongList, dispatch])

    return [finalSongList, isLoading, songError];
};
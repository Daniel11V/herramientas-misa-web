import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSongList, resetSongStatus, setVersionGroups } from "../../../clases/song/actions";
import { arrayIsEmpty, getRating, objIsEmpty } from "../../../utils";

export const useSongListPage = () => {
    const dispatch = useDispatch();

    const [currentSongList, setCurrentSongList] = useState([]);
    const [status, setCurrentSongListStatus] = useState("INITIAL");
    const [isLoading, setIsLoading] = useState(false);

    const userId = useSelector((state) => state.user.google.id);
    const { songList, songStatus, songError, versionGroups } = useSelector((state) => state.song);
    const [fetchWithoutPrivates, setFetchWithoutPrivates] = useState(false)

    useEffect(() => {
        setIsLoading(status !== "FINISHED");
    }, [status])

    const setStatus = (status) => {
        // console.log("ACA SONG_LIST_STATUS: ", status);
        setCurrentSongListStatus(status);
    }

    useEffect(() => {
        setStatus("1_SONG_LIST");
    }, [])


    useEffect(() => {
        if (status === "1_SONG_LIST") {
            if (!arrayIsEmpty(songList)) {
                setCurrentSongList(songList);
                setStatus("2_VERSION_GROUPS");
            } else {
                setStatus("1_FETCH_SONG_LIST");
            }
        }
    }, [status, songList])

    useEffect(() => {
        if (status === "1_FETCH_SONG_LIST") {
            if (songStatus === "INITIAL") {
                dispatch(getSongList({ userId }));
                if (!userId) setFetchWithoutPrivates(true);
            } else if (songStatus === "SUCCESS") {
                setStatus("1_SONG_LIST");
                dispatch(resetSongStatus());
            } else if (songStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongStatus());
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
    }, [status, songStatus, userId, songList, dispatch]);

    useEffect(() => {
        if (status === "2_VERSION_GROUPS") {
            if (!objIsEmpty(versionGroups)) {
                setCurrentSongList(lastCurrentSongList => lastCurrentSongList.filter(song => versionGroups[song?.versionGroupId]?.moreRated === song.id));
                setStatus("FINISHED");
            } else {
                setStatus("2_GET_VERSION_GROUPS");
            }
        }

    }, [status, versionGroups])

    useEffect(() => {
        if (status === "2_GET_VERSION_GROUPS") {
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

                setStatus("2_VERSION_GROUPS");
                dispatch(setVersionGroups(versionGroups));
            }
        }

    }, [status, currentSongList, userId, dispatch])

    useEffect(() => {
        if (fetchWithoutPrivates && userId) {
            if (songStatus === "INITIAL") {
                dispatch(getSongList({ userId, onlyAddPrivates: true }));
            } else if (songStatus === "SUCCESS") {
                setCurrentSongList(songList);
                setStatus("2_GET_VERSION_GROUPS");
                dispatch(resetSongStatus());
                setFetchWithoutPrivates(false);
            } else if (songStatus === "FAILURE") {
                setStatus("FINISHED");
                dispatch(resetSongStatus());
                setFetchWithoutPrivates(false);
            }
        }
    }, [fetchWithoutPrivates, userId, songStatus, songList, dispatch]);


    return [currentSongList, isLoading, songError];
};
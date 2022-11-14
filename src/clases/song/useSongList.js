import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { arrayIsEmpty, getRating } from "../../utils";
import { getSongList, setVersionGroups } from "./actions";

export const useSongList = () => {
    const dispatch = useDispatch();
    const { songList, songListStatus, error } = useSelector((state) => state.song);
    const userId = useSelector((state) => state.user.google.id);
    const [finalSongList, setFinalSongList] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (songListStatus === "INITIAL") {
            dispatch(getSongList({ userId }));
            setIsLoading(true);
        } else if (songListStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
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
            se edita algo de Details se crea nueva Detail en private
        */
    }, [songListStatus, userId, dispatch]);

    useEffect(() => {

        if (!arrayIsEmpty(songList)) {

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

            songList.forEach(song => {
                if (versionGroups[song.versionGroupId]) {
                    const currentSongVersion = songList[versionGroups[song.versionGroupId].moreRated];
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


            const newSongList = [];
            songList.forEach(song => {
                if (versionGroups[song.versionGroupId].moreRated === song.id) {
                    newSongList.push(song);
                }
            })

            setFinalSongList(newSongList);
            dispatch(setVersionGroups(versionGroups));
        }
    }, [songList, userId, dispatch])


    return [finalSongList, isLoading, error];
};
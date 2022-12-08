import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRepertory } from "../../../clases/repertory/actions";
import { getSongList } from "../../../clases/song/actions";

export const useRepertoryPage = (repertoryId) => {
    const dispatch = useDispatch();
    const { repertory, repertoryStatus, error } = useSelector((state) => state.repertory);
    const { songList } = useSelector((state) => state.song);
    const [isLoading, setIsLoading] = useState(false);
    const [repertorySongList, setRepertorySongList] = useState([])
    const userId = useSelector((state) => state.user.google.id);

    useEffect(() => {
        if (repertoryStatus === "INITIAL") {
            dispatch(getRepertory({ userId, repertoryId }));
            dispatch(getSongList({ userId }));
            setIsLoading(true);
        } else if (repertoryStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [repertoryStatus, userId, repertoryId, dispatch]);

    useEffect(() => {
        if (repertory && songList) {
            // console.log("songList", songList)
            const newSongList = {};
            for (const key in repertory?.songs) {
                for (const songId of repertory?.songs?.[key]) {
                    const newSong = songList.find(song => song.id === songId)
                    newSongList[key] = [...(newSongList[key] || []), newSong]
                }
            }
            setRepertorySongList(newSongList);
        }
    }, [repertory, songList]);

    return [repertory, isLoading, error, repertorySongList];
};
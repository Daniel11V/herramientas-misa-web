import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "../../../store/actions/community";

export const useSong = (songId) => {
    const dispatch = useDispatch();
    const { currentSong, currentSongStatus, error } = useSelector((state) => state.community);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state) => state.user.google.id);

    useEffect(() => {
        if (currentSongStatus === "INITIAL") {
            dispatch(getSong({ userId, songId }));
            setIsLoading(true);
        } else if (currentSongStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [currentSongStatus, userId, songId, dispatch]);

    return [currentSong, isLoading, error];
};
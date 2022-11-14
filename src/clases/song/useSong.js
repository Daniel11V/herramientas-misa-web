import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "./actions";

export const useSong = (songId) => {
    const dispatch = useDispatch();
    const { song, songStatus, error } = useSelector((state) => state.song);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state) => state.user.google.id);

    useEffect(() => {
        if (songStatus === "INITIAL") {
            dispatch(getSong({ userId, songId }));
            setIsLoading(true);
        } else if (songStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [songStatus, userId, songId, dispatch]);

    return [song, isLoading, error];
};
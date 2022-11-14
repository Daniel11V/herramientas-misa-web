import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRepertory } from "./actions";

export const useRepertory = (repertoryId) => {
    const dispatch = useDispatch();
    const { repertory, repertoryStatus, error } = useSelector((state) => state.repertory);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state) => state.user.google.id);

    useEffect(() => {
        if (repertoryStatus === "INITIAL") {
            dispatch(getRepertory({ userId, repertoryId }));
            setIsLoading(true);
        } else if (repertoryStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [repertoryStatus, userId, repertoryId, dispatch]);

    return [repertory, isLoading, error];
};
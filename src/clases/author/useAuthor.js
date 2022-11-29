import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthor } from "../../../store/actions/community";

export const useAuthor = (authorId) => {
    const dispatch = useDispatch();
    const { currentAuthor, currentAuthorStatus, error } = useSelector((state) => state.community);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useSelector((state) => state.user.google.id);

    useEffect(() => {
        if (currentAuthorStatus === "INITIAL") {
            dispatch(getAuthor({ userId, authorId }));
            setIsLoading(true);
        } else if (currentAuthorStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [currentAuthorStatus, userId, authorId, dispatch]);

    return [currentAuthor, isLoading, error];
};
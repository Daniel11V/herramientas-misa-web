import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthorList } from "./actions";

export const useAuthorList = () => {
    const dispatch = useDispatch();
    const { authorList, authorListStatus, error } = useSelector((state) => state.author);
    const userId = useSelector((state) => state.user.google.id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (authorListStatus === "INITIAL") {
            dispatch(getAuthorList({ userId }));
            setIsLoading(true);
        } else if (authorListStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [authorListStatus, userId, dispatch]);


    return [authorList, isLoading, error];
};
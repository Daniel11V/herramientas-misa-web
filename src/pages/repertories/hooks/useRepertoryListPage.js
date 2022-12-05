import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRepertoryList } from "../../../clases/repertory/actions";

export const useRepertoryListPage = () => {
    const dispatch = useDispatch();
    const { repertoryList, repertoryListStatus, error } = useSelector((state) => state.repertory);
    const userId = useSelector((state) => state.user.google.id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (repertoryListStatus === "INITIAL") {
            dispatch(getRepertoryList({ userId }));
            setIsLoading(true);
        } else if (repertoryListStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [repertoryListStatus, userId, dispatch]);


    return [repertoryList, isLoading, error];
};
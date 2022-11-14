import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemList } from "./actions";

export const useItemList = () => {
    const dispatch = useDispatch();
    const { itemList, itemListStatus, error } = useSelector((state) => state.item);
    const userId = useSelector((state) => state.user.google.id);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (itemListStatus === "INITIAL") {
            dispatch(getItemList({ userId }));
            setIsLoading(true);
        } else if (itemListStatus === "FETCHING") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [itemListStatus, userId, dispatch]);


    return [itemList, isLoading, error];
};
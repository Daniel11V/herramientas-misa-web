import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemList } from "./actions";
import { IStoreState } from "../../store";
import { fetchStatus } from "../../utils/types";

export const useItemList = () => {
	const dispatch = useDispatch();
	const { itemList, itemListStatus, error } = useSelector(
		(state: IStoreState) => state.item
	);
	const userId = useSelector((state: IStoreState) => state.user.google.id);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (itemListStatus === fetchStatus.INITIAL) {
			dispatch(getItemList({ userId }));
			setIsLoading(true);
		} else if (itemListStatus === fetchStatus.FETCHING) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [itemListStatus, userId, dispatch]);

	return [itemList, isLoading, error];
};

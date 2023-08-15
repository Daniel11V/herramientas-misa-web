// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getItem } from "./actions";

export const useItem = (itemId: string) => {
	// const dispatch = useDispatch();
	// const { currentItem, currentItemStatus, error } = useSelector(
	// 	(state) => state.item
	// );
	// const [isLoading, setIsLoading] = useState(false);
	// const userId = useSelector((state: IStoreState) => state.user.google.id);
	// useEffect(() => {
	// 	if (currentItemStatus === fetchStatus.INITIAL) {
	// 		dispatch(getItem({ userId, itemId }));
	// 		setIsLoading(true);
	// 	} else if (currentItemStatus === fetchStatus.FETCHING) {
	// 		setIsLoading(true);
	// 	} else {
	// 		setIsLoading(false);
	// 	}
	// }, [currentItemStatus, userId, itemId, dispatch]);
	// return [currentItem, isLoading, error];
};

import { useState, useEffect } from "react";
import { getAuthorList } from "./actions";
import { useAppDispatch, useAppSelector } from "../../store";
import { FETCH_STATUS } from "../../utils/types";

export const useAuthorList = () => {
	const dispatch = useAppDispatch();
	const { authorList, authorStatus, authorError } = useAppSelector(
		(state) => state.author
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (authorStatus === FETCH_STATUS.INITIAL) {
			dispatch(getAuthorList());
			setIsLoading(true);
		} else if (authorStatus === FETCH_STATUS.FETCHING) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [authorStatus, dispatch]);

	return [authorList, isLoading, authorError];
};

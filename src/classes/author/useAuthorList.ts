import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthorList } from "./actions";
import { TStoreState } from "../../store";
import { FETCH_STATUS } from "../../utils/types";

export const useAuthorList = () => {
	const dispatch = useDispatch();
	const { authorList, authorStatus, authorError } = useSelector(
		(state: TStoreState) => state.author
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

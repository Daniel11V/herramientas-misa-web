import { useState, useEffect } from "react";
import { getAuthorList } from "./actions";
import { TRootState, useAppDispatch } from "../../store";
import { FETCH_STATUS } from "../../utils/types.d";
import { useSelector } from "react-redux";

export const useAuthorList = () => {
	const dispatch = useAppDispatch();
	const { authorList, authorStatus, authorError } = useSelector(
		(state: TRootState) => state.author
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

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthorList } from "./actions";
import { IStoreState } from "../../store";
import { fetchStatus } from "../../utils/types";

export const useAuthorList = () => {
	const dispatch = useDispatch();
	const { authorList, authorStatus, authorError } = useSelector(
		(state: IStoreState) => state.author
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (authorStatus === fetchStatus.INITIAL) {
			dispatch(getAuthorList());
			setIsLoading(true);
		} else if (authorStatus === fetchStatus.FETCHING) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [authorStatus, dispatch]);

	return [authorList, isLoading, authorError];
};

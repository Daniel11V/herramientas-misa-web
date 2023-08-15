import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../store";
import { getAuthor } from "./actions";
import { fetchStatus } from "../../utils/types";

export const useAuthor = (p: { authorId: string }) => {
	const { authorId } = p;

	const dispatch = useDispatch();
	const { author, authorStatus, authorError } = useSelector(
		(state: IStoreState) => state.author
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (authorStatus === fetchStatus.INITIAL) {
			dispatch(getAuthor({ authorId }));
			setIsLoading(true);
		} else if (authorStatus === fetchStatus.FETCHING) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [authorStatus, authorId, dispatch]);

	return [author, isLoading, authorError];
};

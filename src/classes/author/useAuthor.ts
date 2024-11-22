import { useEffect, useState } from "react";
import { TRootState, useAppDispatch } from "../../store";
import { getAuthor } from "./actions";
import { FETCH_STATUS } from "../../utils/types.d";
import { useSelector } from "react-redux";

export const useAuthor = (p: { authorId: string }) => {
	const { authorId } = p;

	const dispatch = useAppDispatch();
	const { author, authorStatus, authorError } = useSelector(
		(state: TRootState) => state.author
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (authorStatus === FETCH_STATUS.INITIAL) {
			dispatch(getAuthor({ authorId }));
			setIsLoading(true);
		} else if (authorStatus === FETCH_STATUS.FETCHING) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [authorStatus, authorId, dispatch]);

	return [author, isLoading, authorError];
};

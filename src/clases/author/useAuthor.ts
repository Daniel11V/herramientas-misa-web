import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthor } from "./actions";

export const useAuthor = (p: { authorId: string }) => {
	const { authorId } = p;

	const dispatch = useDispatch();
	const { author, authorStatus, error } = useSelector((state) => state.author);
	const [isLoading, setIsLoading] = useState(false);
	const userId = useSelector((state) => state.user.google.id);

	useEffect(() => {
		if (authorStatus === "INITIAL") {
			dispatch(getAuthor({ userId, authorId }));
			setIsLoading(true);
		} else if (authorStatus === "FETCHING") {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [authorStatus, userId, authorId, dispatch]);

	return [author, isLoading, error];
};

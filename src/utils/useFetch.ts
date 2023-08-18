import { useState, useEffect, MutableRefObject } from "react";
import { errorMessage } from "./errors";

export const useFetch = (
	url: string,
	isComponentMounted: MutableRefObject<boolean>
) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [controller, setController] = useState<AbortController | null>(null);
	// const isComponentMounted = useRef(true);

	useEffect(() => {
		const abortController = new AbortController();
		setController(abortController);
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await fetch(url);
				const jsonData = await response.json();
				setData(jsonData);
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					// console.log("Request cancelled");
				} else {
					setError(errorMessage(error));
				}
			} finally {
				setLoading(false);
			}
		};

		if (isComponentMounted.current && url) fetchData();
		return () => {
			isComponentMounted.current = false;
			abortController.abort();
		};
	}, [url]);

	const handleCancelRequest = () => {
		if (controller) {
			controller.abort();
			setError("Request cancelled");
		}
	};

	return {
		data,
		error,
		loading,
		handleCancelRequest,
	};
};

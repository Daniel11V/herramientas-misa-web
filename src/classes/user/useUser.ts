import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading, setDevice } from "./actions";
import { TStoreState } from "../../store";

export const useUser = () => {
	const dispatch = useDispatch();
	const { loading, error, isLogged, ...userData } = useSelector(
		(state: TStoreState) => state.user
	);

	const [isFirstTime, setIsFirstTime] = useState(true);

	const getIsDesktop = (): boolean => {
		// setIsDesktop(window.matchMedia("(min-width: 990px)").matches);
		// setIsDesktop(window.screen.width > 1280);
		// return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		//     navigator.userAgent
		// )
		const isMobileFirst = true;
		const clientWidth = document.querySelector("body")?.clientWidth;
		if (clientWidth !== undefined) {
			return clientWidth > 992;
		} else {
			return isMobileFirst ? false : true;
		}
	};

	useEffect(() => {
		if (isFirstTime) {
			dispatch(setUserLoading(true));

			window.addEventListener("resize", () => {
				dispatch(setDevice(getIsDesktop()));
			});
			dispatch(setDevice(getIsDesktop()));

			setIsFirstTime(false);
		}

		return () => {
			window.removeEventListener("resize", getIsDesktop);
		};
	}, [dispatch, isFirstTime]);

	return { user: userData, loading, isLogged, error };
};

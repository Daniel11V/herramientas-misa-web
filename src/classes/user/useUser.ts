import { useState, useEffect } from "react";
import { setDevice, setUserLoading } from "./reducers";
import { TRootState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";

export const useUser = () => {
	const dispatch = useAppDispatch();
	const { loading, error, isLogged, ...userData } = useSelector(
		(state: TRootState) => state.user
	);

	const [isFirstLoad, setIsFirstLoad] = useState(true);

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
		if (isFirstLoad) {
			dispatch(setUserLoading(true));

			window.addEventListener("resize", () => {
				dispatch(setDevice(getIsDesktop()));
			});
			dispatch(setDevice(getIsDesktop()));

			setIsFirstLoad(false);
		}

		return () => {
			window.removeEventListener("resize", getIsDesktop);
		};
	}, [dispatch, isFirstLoad]);

	return { user: userData, loading, isLogged, error };
};

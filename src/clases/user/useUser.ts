import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading, setDevice } from "./actions";

export const useUser = () => {
    const dispatch = useDispatch();
    const { user, loading, error, isLogged } = useSelector((state) => state.user);

    const [isFirstTime, setIsFirstTime] = useState(true);

    const getIsDesktop = () => {
        // setIsDesktop(window.matchMedia("(min-width: 990px)").matches);
        // setIsDesktop(window.screen.width > 1280);
        return (document.querySelector('body').clientWidth > 992);
        // console.log("ACA size", document.querySelector('body').clientWidth > 992);
        // return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        //     navigator.userAgent
        // )
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

    return { user, loading, isLogged, error };
};
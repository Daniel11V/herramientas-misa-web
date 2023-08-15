import { IActionType } from "../../utils/types.js";
import { IUserState } from "./reducers.js";

export const types = {
	SET_USER_LOADING: "SET_USER_LOADING",

	LOGIN: "LOGIN",
	LOGOUT: "LOGOUT",

	SET_DEVICE: "SET_DEVICE",

	SET_USER_SONG_PAGE_OPTIONS: "SET_USER_SONG_PAGE_OPTIONS",
};

export const setUserLoading = (
	loading: IUserState["loading"]
): IActionType => ({
	type: types.SET_USER_LOADING,
	payload: { loading },
});

export const login = (googleInfo: IUserState["google"]): IActionType => ({
	type: types.LOGIN,
	payload: { googleInfo },
});

export const logout = (): IActionType => ({
	type: types.LOGOUT,
});

export const setDevice = (isDesktop: IUserState["isDesktop"]): IActionType => ({
	type: types.SET_DEVICE,
	payload: { isDesktop },
});

export const setSongPageOptions = (
	songPageOptions: IUserState["config"]["songPageOptions"]
): IActionType => ({
	type: types.SET_USER_SONG_PAGE_OPTIONS,
	payload: { songPageOptions },
});

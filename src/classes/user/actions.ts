import { TActionType } from "../../utils/types.js";
import { TUserState } from "./reducers.js";
import { TUserGoogle } from "./types.js";

export const types = {
	SET_USER_LOADING: "SET_USER_LOADING",

	LOGIN: "LOGIN",
	LOGOUT: "LOGOUT",

	SET_DEVICE: "SET_DEVICE",

	SET_USER_SONG_PAGE_OPTIONS: "SET_USER_SONG_PAGE_OPTIONS",
};

export const setUserLoading = (
	loading: TUserState["loading"]
): TActionType => ({
	type: types.SET_USER_LOADING,
	payload: { loading },
});

export const login = (googleInfo: TUserGoogle): TActionType => ({
	type: types.LOGIN,
	payload: { googleInfo },
});

export const logout = (): TActionType => ({
	type: types.LOGOUT,
});

export const setDevice = (isDesktop: TUserState["isDesktop"]): TActionType => ({
	type: types.SET_DEVICE,
	payload: { isDesktop },
});

export const setSongPageOptions = (
	songPageOptions: TUserState["config"]["songPageOptions"]
): TActionType => ({
	type: types.SET_USER_SONG_PAGE_OPTIONS,
	payload: { songPageOptions },
});

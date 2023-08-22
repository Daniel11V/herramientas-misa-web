import { TUserState } from "./reducers.js";
import { TUserGoogle } from "./types.js";

export const types = {
	SET_USER_LOADING: "SET_USER_LOADING",

	LOGIN: "LOGIN",
	LOGOUT: "LOGOUT",

	SET_DEVICE: "SET_DEVICE",

	SET_USER_SONG_PAGE_OPTIONS: "SET_USER_SONG_PAGE_OPTIONS",
} as const;

export const setUserLoading = (loading: TUserState["loading"]) => ({
	type: types.SET_USER_LOADING,
	payload: { loading },
});

export const login = (googleInfo: TUserGoogle) => ({
	type: types.LOGIN,
	payload: { googleInfo },
});

export const logout = () => ({
	type: types.LOGOUT,
});

export const setDevice = (isDesktop: TUserState["isDesktop"]) => ({
	type: types.SET_DEVICE,
	payload: { isDesktop },
});

export const setSongPageOptions = (
	songPageOptions: TUserState["config"]["songPageOptions"]
) => ({
	type: types.SET_USER_SONG_PAGE_OPTIONS,
	payload: { songPageOptions },
});

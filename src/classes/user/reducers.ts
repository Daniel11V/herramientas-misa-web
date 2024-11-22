import { TUserDB, TUserGoogle } from "./types.d";
import { valid } from "../../utils/generalUtils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TUserState {
	loading: boolean;
	error: string | null;

	isLogged: boolean;
	google: TUserGoogle;
	config: TUserDB["config"];

	isDesktop: boolean | null;
}

const initialState: TUserState = {
	loading: false,
	error: null,

	isLogged: false, // PREDEPLOY
	// isLogged: true,
	google: {
		id: "", // PREDEPLOY
		name: "", // PREDEPLOY
		// id: '111418653738749034139',
		// name: 'Daniel Vinet',
		imageUrl: "",
		email: "",
		accessToken: "",
	},
	config: {
		songPageOptions: {
			fontSize: "16",
			showChords: true,
			chordLang: "en",
		},
	},

	isDesktop: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action: PayloadAction<TUserState['loading']>) => {
		state.loading = valid(action.payload, 'setUserLoading');
    },
    login: (state, action: PayloadAction<{googleInfo: TUserState['google']}>) => {
		state.google = valid(action.payload?.googleInfo, 'login');
		state.isLogged = true;
		state.loading = false;
    },
    logout: (state) => {
		state.google = initialState.google;
		state.loading = false;
		state.error = null;
		state.isLogged = false;
    },
    setDevice: (state, action: PayloadAction<TUserState['isDesktop']>) => {
		state.isDesktop = valid(action.payload, 'setDevice');
    },
    setUserSongPageOptions: (state, action: PayloadAction<{songPageOptions: TUserState['config']['songPageOptions']}>) => {
		state.config.songPageOptions = valid(action.payload?.songPageOptions, 'setUserSongPageOptions');
    },
  },
});

export const { setUserLoading, login, logout, setDevice, setUserSongPageOptions } = userSlice.actions;
export default userSlice.reducer;
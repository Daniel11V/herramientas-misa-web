import { produce } from "immer";
import { types } from "./actions";
import { TUserDB, TUserGoogle } from "./types";
import { valid } from "../../utils/generalUtils";
import { Dispatch } from "react";

export type TUserState = {
	loading: boolean;
	error: string | null;

	isLogged: boolean;
	google: TUserGoogle;
	config: TUserDB["config"];

	isDesktop: boolean | null;
};

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

export type TUserActionType = (typeof types)[keyof typeof types];

export type TUserActionPayload = Partial<TUserState> & {
	googleInfo?: TUserGoogle;
	songPageOptions?: TUserDB["config"]["songPageOptions"];
};

export type TUserAction = {
	type: TUserActionType;
	payload?: TUserActionPayload;
};

const UserReducer = (state = initialState, { type, payload }: TUserAction) => {
	return produce(state, (newState: TUserState): void => {
		if (type === types.SET_USER_LOADING) {
			newState.loading = valid(payload?.loading, type);
		}

		if (type === types.LOGIN) {
			newState.google = valid(payload?.googleInfo, type);
			newState.isLogged = true;
			newState.loading = false;
		}
		if (type === types.LOGOUT) {
			newState.google = initialState.google;
			newState.loading = false;
			newState.error = null;
			newState.isLogged = false;
		}

		if (type === types.SET_DEVICE) {
			newState.isDesktop = valid(payload?.isDesktop, type);
		}

		if (type === types.SET_USER_SONG_PAGE_OPTIONS) {
			newState.config.songPageOptions = valid(payload?.songPageOptions, type);
		}
	});
};

export type TUserSelectedActionPayload = {
	[types.SET_USER_LOADING]: {
		loading: TUserActionPayload["loading"];
	};

	[types.LOGIN]: {
		googleInfo: TUserActionPayload["googleInfo"];
	};
	[types.LOGOUT]: undefined;

	[types.SET_DEVICE]: {
		isDesktop: TUserActionPayload["isDesktop"];
	};

	[types.SET_USER_SONG_PAGE_OPTIONS]: {
		songPageOptions: TUserActionPayload["songPageOptions"];
	};
};

type TUserSelectedAction<T extends TUserActionType> =
	TUserSelectedActionPayload[T] extends undefined
		? { type: T }
		: { type: T; payload: TUserSelectedActionPayload[T] };

export type TUserDispatch = <T extends TUserActionType>(
	action: TUserSelectedAction<T>
) => Dispatch<TUserSelectedAction<T>>;

export default UserReducer;

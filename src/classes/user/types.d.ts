import { TChordLangs } from "../../utils/types";

export type TUserId = string;

export type TUserGoogle = {
	id: TUserId;
	name: string;
	imageUrl: string;
	email: string;
	accessToken: string;
}

export type TUserDB = {
	id: TUserId;
	name: TUserGoogle["name"];
	email: TUserGoogle["email"];
	photoUrl?: TUserGoogle["imageUrl"];
	config: {
		songPageOptions: {
			fontSize: string;
			showChords: true;
			chordLang: TChordLangs;
		};
	};
};

export type TUserListDB = Record<TUserId, TUserDB>;

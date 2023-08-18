import { TChordLangs } from "../../utils/types";

export type TUserId = string;

export type TUserDB = {
	id: TUserId;
	name: string;
	email: string;
	photoUrl: string;
	config: {
		songPageOptions: {
			fontSize: string;
			showChords: true;
			chordLang: TChordLangs;
		};
	};
};

export type TUserListDB = Record<TUserId, TUserDB>;

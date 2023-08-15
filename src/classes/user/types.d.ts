import { IChordLangs } from "../../utils/types";

export interface IUserDB {
	id: string;
	name: string;
	email: string;
	photoUrl: string;
	config: {
		songPageOptions: {
			fontSize: string;
			showChords: true;
			chordLang: IChordLangs;
		};
	};
}

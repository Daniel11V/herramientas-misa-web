import { ISong } from "../song/types";
import { IUserDB } from "../user/types";

export interface IRepertory {
	id: string;
	isPrivate: boolean;
	title: string;
	annotations: string;
	placeTitle: string;
	placeUbication: string;
	isMass: boolean;
	creator: Creator;
	members?: Array;
	songSections: Array<{
		name: string;
		songs: Array<ISong["id"]>;
	}>;
	hasAccess?: Record<IUserDB["id"], IUserDB["name"]>;
}

export interface IPublicRepertoryDB extends Omit<IRepertory, "hasAccess"> {}

export interface IPrivateRepertoryDB extends Omit<IRepertory, "hasAccess"> {
	hasAccess: Record<IUserDB["id"], IUserDB["name"]>;
}

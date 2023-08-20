import { TSong, TSongId } from "../song/types";
import { TUserDB, TUserId } from "../user/types";

export type TRepertoryId = string;

export type TRepertoryMember = {
	id: TUserId;
	name: TUserDB["name"];
	access: string;
};

export type TRepertory = {
	id: TRepertoryId;
	isPrivate: boolean;
	title: string;
	annotations: string;
	placeTitle: string;
	placeUbication: string;
	isMass: boolean;
	creator: Creator;
	members?: Record<TUserId, TRepertoryMember>;
	songSections: Array<{
		name: string;
		songs: TSongId[];
	}>;
};

export type TPublicRepertoryDB = Omit<TRepertory, "isPrivate">;

export type TPublicRepertoryListDB = Record<
	TPublicRepertoryDB["id"],
	TPublicRepertoryDB
>;

export type TPrivateRepertoryDB = Omit<TRepertory, "isPrivate">;

export type TPrivateRepertoryListDB = Record<
	TPrivateRepertoryDB["id"],
	TPrivateRepertoryDB
>;

export type TRepertoryForm = Omit<TRepertory, "id" | "isPrivate">;

export type TSongSections = Array<{
	name: string;
	songs: TSong[];
}>;

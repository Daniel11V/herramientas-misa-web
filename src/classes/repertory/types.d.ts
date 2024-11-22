import { TCreator, TSong, TSongId } from "../song/types.d";
import { TUserDB, TUserId } from "../user/types.d";

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
	placeTitle: string;
	placeUbication: string;
	isMass: boolean;
	creator: TCreator;
	annotations?: string;
	members?: Record<TUserId, TRepertoryMember>;
	songSections: TSongSections;
};

export type TSongSections = Array<{
	name: string;
	songs: TSongId[];
}>;

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

export type TRepertoryList = Record<TRepertoryId, TRepertory>;

export type TRepertoryTitles = {
	id: TRepertoryId;
	isPrivate: boolean;
	title: string;
	placeTitle: string;
	placeUbication: string;
	isMass: boolean;
	creator: TCreator;
	annotations?: string;
	members?: Record<TUserId, TRepertoryMember>;
	songSections: TSongSectionsTitle;
};

export type TSongSectionsTitle = Array<{
	name: string;
	songs: TSong[];
}>;

import { validBool, validString } from "../../utils/generalUtils";
import { TRepertory } from "./types";

export const createTRepertory = ({
	id,
	isPrivate,
	title,
	placeTitle,
	placeUbication,
	isMass,
	creator,
	annotations,
	members,
	songSections,
}: Partial<TRepertory>): TRepertory => {
	const typeName = "TRepertory";

	const newTSong: TRepertory = {
		id: validString(id, typeName),
		isPrivate: validBool(isPrivate, typeName),
		title: validString(title, typeName),
		placeTitle: validString(placeTitle, typeName),
		placeUbication: validString(placeUbication, typeName),
		isMass: validBool(isMass, typeName),
		creator: {
			id: validString(creator?.id, typeName),
			name: validString(creator?.name, typeName),
		},
		songSections: songSections as TRepertory["songSections"],
		annotations,
		members,
	};

	return newTSong;
};

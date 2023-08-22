import {
	validArray,
	validBool,
	validObject,
	validString,
} from "../../utils/generalUtils";
import { TSongId } from "../song/types";
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
		songSections: validArray<{
			name: string;
			songs: TSongId[];
		}>(songSections, typeName, {
			func: "validObject",
			params: {
				name: "validString",
				songs: "validArray",
			},
		}),
		annotations,
		members,
	};

	return newTSong;
};

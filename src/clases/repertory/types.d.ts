export interface PublicRepertory {
	id: string;
	isPrivate: boolean;
	title: string;
	annotations: string;
	placeTitle: string;
	placeUbication: string;
	isMass: boolean;
	creator: Creator;
	members?: Array;
	songSections: {
		name: string;
		songs: Array<string>; // Array of songIds
	};
}

export interface privateRepertoryModel extends PublicRepertory {
	hasAccess: {
		$userId: string; // name
		// ...
	};
}

export interface Repertory extends PublicRepertory {}

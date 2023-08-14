export interface IAuthor {
	id: string;
	name: string;
}

export interface IAuthorDB extends IAuthor {
	email?: string;
	photoUrl?: string;
	creatorId: string;
	songTitleIds: Array<string>;
}

export interface IAuthorDB extends IAuthor {
	id: string;
	name: string;
	email?: string;
	photoUrl?: string;
	creatorId: string;
	songTitleIds: Array<string>;
}

export interface IAuthor extends Pick<IAuthorDB, "id" | "name"> {}

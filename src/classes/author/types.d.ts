export type TAuthorId = string;

export type TAuthorDB = {
	id: TAuthorId;
	name: string;
	email?: string;
	photoUrl?: string;
	creatorId: string;
	songTitleIds: Array<string>;
};

export type TAuthor = Pick<TAuthorDB, "id" | "name">;

export type TAuthorListDB = Record<TAuthorId, TAuthorDB>;

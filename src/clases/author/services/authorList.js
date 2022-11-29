import store from "../../../store";

export const authorModel = {
    id: { type: "String", required: true },
    name: { type: "String", required: false },
    email: { type: "String", required: false },
    photoUrl: { type: "String", required: false },
    creatorId: { type: "String", required: true },
    songTitleIds: { type: "Array of strings", required: true },
};


export const getAuthorListDB = async () => {

    const authorList = store.getState().database.authorList;

    if (!authorList) throw new Error("Error fetching.");

    return authorList;
}

export const getAuthorDB = async ({ authorId }) => {
    if (!authorId) throw new Error("Invalid author ID.");

    const author = store.getState().database.authorList(authorId);

    if (!author) throw new Error("Author not found.");

    return author;
}

export const createAuthorDB = async ({ authorCreated }) => {
    if (!authorCreated?.id) throw new Error("Invalid author ID.");

    store.getState().database.authorList[authorCreated.id] = authorCreated;
}

export const editAuthorDB = async ({ authorEdited }) => {

}

export const deleteAuthorDB = async ({ authorDeletedId }) => {

}
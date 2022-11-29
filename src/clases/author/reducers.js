import { types } from "./types"

const defaultAuthor = {
    id: "0",
    name: "",
    email: "",
    photoUrl: "",
    creatorId: "",
    songTitleIds: [],
}

const initialState = {
    authorStatus: "INITIAL",
    authorError: null,

    authorList: [],
    author: defaultAuthor,
}

const AuthorReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.RESET_AUTHOR_STATUS:
            return { ...state, authorStatus: "INITIAL", authorError: null }

        case types.SET_AUTHOR_LIST:
            return { ...state, authorList: payload.authorList, authorStatus: payload.authorStatus }
        case types.SET_AUTHOR_LIST_STATUS:
            return { ...state, authorStatus: payload.authorStatus, authorError: payload.error }

        case types.SET_AUTHOR:
            return { ...state, author: { ...payload.author }, authorStatus: payload.authorStatus }
        case types.SET_AUTHOR_STATUS:
            return { ...state, authorStatus: payload.authorStatus, authorError: payload.error }

        case types.CREATE_AUTHOR:
            return {
                ...state, authorList: {
                    ...state.authorList,
                    [payload.authorCreated.id]: payload.authorCreated
                },
                author: { ...payload.authorCreated }
            }
        case types.EDIT_AUTHOR:
            return {
                ...state, authorList: {
                    ...state.authorList,
                    [payload.authorEdited.id]: payload.authorEdited
                },
                author: { ...payload.authorEdited }
            }
        case types.DELETE_AUTHOR:
            let newAuthorList = { ...state.authorList };
            delete newAuthorList[payload.authorDeletedId];
            return {
                ...state, authorList: newAuthorList,
                author: defaultAuthor,
            }

        default:
            return state
    }
}

export default AuthorReducer
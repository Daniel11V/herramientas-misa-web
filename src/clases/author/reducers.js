import produce from "immer";
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
    return produce(state, newState => {
        switch (type) {
            case types.RESET_AUTHOR_STATUS:
                newState.authorStatus = "INITIAL";
                newState.authorError = null;
                break;

            case types.SET_AUTHOR_LIST:
                newState.authorList = payload.authorList;
                newState.authorStatus = payload.authorStatus;
                break;
            case types.SET_AUTHOR_LIST_STATUS:
                newState.authorStatus = payload.authorStatus;
                newState.authorError = payload.error;
                break;

            case types.SET_AUTHOR:
                newState.author = payload.author;
                newState.authorStatus = payload.authorStatus;
                break;
            case types.SET_AUTHOR_STATUS:
                newState.authorStatus = payload.authorStatus;
                newState.authorError = payload.error;
                break;

            case types.CREATE_AUTHOR:
                newState.authorList[payload.authorCreated.id] = payload.authorCreated;
                newState.author = payload.authorCreated;
                break;
            case types.EDIT_AUTHOR:
                newState.authorList[payload.authorEdited.id] = payload.authorEdited;
                newState.author = payload.authorEdited;
                break;
            case types.DELETE_AUTHOR:
                delete newState.authorList[payload.authorDeletedId];
                newState.author = defaultAuthor;
                break;

            default:
                break;
        }
    });
}

export default AuthorReducer
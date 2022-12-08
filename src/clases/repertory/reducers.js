import produce from "immer";
import { types } from "./types"

const defaultRepertory = {
    id: "0",
    title: "",
    isPrivate: true,
    annotations: "",
    placeTitle: "",
    placeUbication: "",
    isMass: false,
    creator: {
        id: "",
        name: "",
    },
    members: [],
    songs: {},
}

const initialState = {
    repertoryActionStatus: "INITIAL",
    repertoryError: null,

    repertoryListStatus: "INITIAL",
    repertoryListUserId: null,
    repertoryList: [],

    repertory: defaultRepertory,
}

const RepertoryReducer = (state = initialState, { type, payload }) => {
    return produce(state, newState => {
        switch (type) {
            case types.SET_REPERTORY_LIST_STATUS:
                newState.repertoryListStatus = payload.repertoryListStatus;
                break;
            case types.SET_REPERTORY_LIST_USER_ID:
                newState.repertoryListUserId = payload.repertoryListUserId;
                break;
            case types.RESET_REPERTORY_ACTION_STATUS:
                newState.repertoryActionStatus = "INITIAL";
                newState.repertoryError = null;
                break;

            case types.FETCH_REPERTORY_LIST:
                newState.repertoryActionStatus = "FETCHING";
                break;
            case types.FETCH_REPERTORY_LIST_SUCCESS:
                newState.repertoryActionStatus = "SUCCESS";
                newState.repertoryList = payload.repertoryList;
                newState.repertoryListStatus = payload.userId ? "PRIVATE" : "PUBLIC";
                newState.repertoryListUserId = payload.userId;
                break;
            case types.FETCH_REPERTORY_LIST_FAILURE:
                newState.repertoryActionStatus = "FAILURE";
                newState.repertoryError = payload.error;
                newState.repertoryListStatus = "FAILURE";
                break;

            case types.FETCH_REPERTORY:
                newState.repertoryActionStatus = "FETCHING";
                break;
            case types.FETCH_REPERTORY_SUCCESS:
                newState.repertoryActionStatus = "SUCCESS";
                newState.repertory = payload.repertory;
                break;
            case types.FETCH_REPERTORY_FAILURE:
                newState.repertoryActionStatus = "FAILURE";
                newState.repertoryError = payload.error;
                break;

            case types.CREATE_REPERTORY:
                newState.repertoryActionStatus = "FETCHING";
                break;
            case types.CREATE_REPERTORY_SUCCESS:
                newState.repertoryActionStatus = "SUCCESS";
                newState.repertoryList.push(payload.repertoryCreated);
                newState.repertoryListStatus = "SHOULD_UPDATE";
                newState.repertory = payload.repertoryCreated;
                break;
            case types.CREATE_REPERTORY_FAILURE:
                newState.repertoryActionStatus = "FAILURE";
                newState.repertoryError = payload.error;
                break;

            case types.EDIT_REPERTORY:
                newState.repertoryActionStatus = "FETCHING";
                break;
            case types.EDIT_REPERTORY_SUCCESS:
                newState.repertoryActionStatus = "SUCCESS";
                newState.repertoryList = state.repertoryList.map(repertory => repertory.id === payload.repertoryEdited.id ? payload.repertoryEdited : repertory);
                newState.repertoryListStatus = "SHOULD_UPDATE";
                newState.repertory = payload.repertoryEdited;
                break;
            case types.EDIT_REPERTORY_FAILURE:
                newState.repertoryActionStatus = "FAILURE";
                newState.repertoryError = payload.error;
                break;

            case types.DELETE_REPERTORY:
                newState.repertoryActionStatus = "FETCHING";
                break;
            case types.DELETE_REPERTORY_SUCCESS:
                newState.repertoryActionStatus = "SUCCESS";
                delete newState.repertoryList[payload.repertoryDeletedId];
                newState.repertoryListStatus = "SHOULD_UPDATE";
                newState.repertory = defaultRepertory;
                break;
            case types.DELETE_REPERTORY_FAILURE:
                newState.repertoryActionStatus = "FAILURE";
                newState.repertoryError = payload.error;
                break;

            default:
                break;
        }
    });
}

export default RepertoryReducer
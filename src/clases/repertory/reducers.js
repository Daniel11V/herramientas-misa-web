import { types } from "./types"

const defaultRepertory = {
    id: "0",
    title: "",
    lyric: "",
    chords: {},
    creator: "",
    author: "",
    rating: [],
    tempo: "",
    pulse: "",
    labels: [],
}

const initialState = {
    error: null,

    repertoryListStatus: "INITIAL",
    repertoryList: [],

    repertoryStatus: "INITIAL",
    repertory: defaultRepertory,
}

const RepertoryReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_REPERTORY_LIST:
            return { ...state, repertoryList: payload.repertoryList, repertoryListStatus: payload.repertoryListStatus }
        case types.SET_REPERTORY_LIST_STATUS:
            return { ...state, repertoryListStatus: payload.repertoryListStatus, error: payload.error }

        case types.SET_REPERTORY:
            return { ...state, repertory: { ...payload.repertory }, repertoryStatus: payload.repertoryStatus }
        case types.SET_REPERTORY_STATUS:
            return { ...state, repertoryStatus: payload.repertoryStatus, error: payload.error }

        case types.CREATE_REPERTORY:
            return {
                ...state, repertoryList: {
                    ...state.repertoryList,
                    [payload.repertoryCreated.id]: payload.repertoryCreated
                },
                repertory: { ...payload.repertoryCreated }
            }
        case types.EDIT_REPERTORY:
            return {
                ...state, repertoryList: {
                    ...state.repertoryList,
                    [payload.repertoryEdited.id]: payload.repertoryEdited
                },
                repertory: { ...payload.repertoryEdited }
            }
        case types.DELETE_REPERTORY:
            let newRepertoryList = { ...state.repertoryList };
            delete newRepertoryList[payload.repertoryDeletedId];
            return {
                ...state, repertoryList: newRepertoryList,
                repertory: defaultRepertory,
            }

        default:
            return state
    }
}

export default RepertoryReducer
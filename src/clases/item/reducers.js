import { types } from "./types"

const defaultItem = {
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

    itemListStatus: "INITIAL",
    itemList: [],

    itemStatus: "INITIAL",
    item: defaultItem,
}

const ItemReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_ITEM_LIST:
            return { ...state, itemList: payload.itemList, itemListStatus: payload.itemListStatus }
        case types.SET_ITEM_LIST_STATUS:
            return { ...state, itemListStatus: payload.itemListStatus, error: payload.error }

        case types.SET_ITEM:
            return { ...state, item: { ...payload.item }, itemStatus: payload.itemStatus }
        case types.SET_ITEM_STATUS:
            return { ...state, itemStatus: payload.itemStatus, error: payload.error }

        case types.CREATE_ITEM:
            return {
                ...state, itemList: {
                    ...state.itemList,
                    [payload.itemCreated.id]: payload.itemCreated
                },
                item: { ...payload.itemCreated }
            }
        case types.EDIT_ITEM:
            return {
                ...state, itemList: {
                    ...state.itemList,
                    [payload.itemEdited.id]: payload.itemEdited
                },
                item: { ...payload.itemEdited }
            }
        case types.DELETE_ITEM:
            let newItemList = { ...state.itemList };
            delete newItemList[payload.itemDeletedId];
            return {
                ...state, itemList: newItemList,
                item: defaultItem,
            }

        default:
            return state
    }
}

export default ItemReducer
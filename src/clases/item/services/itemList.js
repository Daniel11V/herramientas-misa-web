import store from "../../../store";

export const getItemListDB = async ({ userId }) => {

    const itemList = store.getState().database.itemList;

    if (!itemList) throw new Error("Error fetching.");

    return itemList;
}

export const getItemDB = async ({ userId, itemId }) => {
    if (!itemId) throw new Error("Invalid item ID.");

    const item = store.getState().database.itemList(itemId);

    if (!item) throw new Error("Item not found.");

    return item;
}

export const createItemDB = async ({ itemCreated }) => {
    if (!itemCreated) throw new Error("Invalid item ID.");

    store.getState().database.itemList[itemCreated.id] = itemCreated;
}

export const editItemDB = async ({ itemEdited }) => {

}

export const deleteItemDB = async ({ itemDeletedId }) => {

}
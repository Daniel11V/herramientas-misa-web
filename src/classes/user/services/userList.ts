import store from "../../../store";
import { setDatabaseItem } from "../../database/reducers";
import { TUserDB, TUserId } from "../types";

export const getUserListDB = async (): Promise<
	Record<TUserId, TUserDB>
> => {
	const userList = store.getState().database.userList;

	if (!userList) throw new Error("Error fetching.");

	return userList;
};

export const getUserDB = async (p: {
	userId: string;
}): Promise<TUserDB> => {
	const { userId } = p;

	if (!userId) throw new Error("Invalid user ID.");

	const user = store.getState().database.userList[userId];

	if (!user) throw new Error("User not found.");

	return user;
};

export const createUserDB = async (p: {
	userCreated: TUserDB;
}): Promise<void> => {
	const { userCreated } = p;

	if (!userCreated?.id) throw new Error("Invalid user ID.");

	await store.dispatch(
		setDatabaseItem("userList", userCreated.id, userCreated)
	);
};

export const editUserDB = async (p: {
	userEdited: TUserDB;
}): Promise<void> => {
	const { userEdited } = p;
};

export const deleteUserDB = async (p: {
	userDeletedId: string;
}): Promise<void> => {
	const { userDeletedId } = p;
};

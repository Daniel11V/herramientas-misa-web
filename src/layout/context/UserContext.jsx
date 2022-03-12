import React from "react";

const UserContext = React.createContext();

function UserProvider({ children }) {
	const [user, setUser] = React.useState({});
	const value = React.useMemo(() => [user, setUser], [user]);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
	const context = React.useContext(UserContext);
	if (context === undefined) {
		throw new Error("useSongs must be used within a SongsProvider");
	}
	return context;
}

export { UserProvider, useUser };
